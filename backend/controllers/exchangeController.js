import { Exchange, ExchangeBook, Book, User } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Create exchange request
 */
export const createExchange = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { owner_id, offered_book_id, requested_book_id } = req.body;

    // Check if books exist
    let offeredBook = null;
    if (offered_book_id) {
      offeredBook = await Book.findByPk(offered_book_id);
      if (!offeredBook) {
        return res.status(404).json({ success: false, message: 'Offered book not found' });
      }
    }

    const requestedBook = await Book.findByPk(requested_book_id);
    if (!requestedBook) {
      return res.status(404).json({
        success: false,
        message: 'Requested book not found'
      });
    }

    // Create exchange
    const exchange = await Exchange.create({
      owner_id,
      requester_id: userId,
      exchange_status: 'pending'
    });

    // Create exchange books mapping
    await ExchangeBook.create({
      exchange_id: exchange.exchange_id,
      offered_book_id,
      requested_book_id
    });

    res.status(201).json({
      success: true,
      message: 'Exchange request created',
      exchange
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user exchanges
 */
export const getUserExchanges = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      [Op.or]: [{ owner_id: userId }, { requester_id: userId }]
    };
    if (status) whereClause.exchange_status = status;

    const { count, rows } = await Exchange.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'owner', attributes: ['user_id', 'name', 'email'] },
        { model: User, as: 'requester', attributes: ['user_id', 'name', 'email'] },
        {
          model: ExchangeBook,
          as: 'exchangeBooks',
          include: [
            { model: Book, as: 'offeredBook' },
            { model: Book, as: 'requestedBook' }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['exchange_date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      exchanges: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Accept exchange request
 */
export const acceptExchange = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { exchangeId } = req.params;

    const exchange = await Exchange.findByPk(exchangeId);
    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: 'Exchange not found'
      });
    }

    // Only owner can accept
    if (exchange.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await exchange.update({ exchange_status: 'accepted' });

    res.status(200).json({
      success: true,
      message: 'Exchange accepted',
      exchange
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reject exchange request
 */
export const rejectExchange = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { exchangeId } = req.params;

    const exchange = await Exchange.findByPk(exchangeId);
    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: 'Exchange not found'
      });
    }

    // Only owner can reject
    if (exchange.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await exchange.update({ exchange_status: 'rejected' });

    res.status(200).json({
      success: true,
      message: 'Exchange rejected',
      exchange
    });
  } catch (error) {
    next(error);
  }
};
