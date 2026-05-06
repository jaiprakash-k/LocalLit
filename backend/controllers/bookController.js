import { Book, BookImage, BookCategory, User, UserLocation } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Create a new book listing
 */
export const createBook = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { title, author, description, price, condition, listing_type, city, state } = req.body;
    let { category_id, new_category } = req.body;

    // Handle new category creation
    if (new_category) {
      const formattedCategory = new_category.trim();
      const [categoryRecord] = await BookCategory.findOrCreate({
        where: { category_name: formattedCategory }
      });
      category_id = categoryRecord.category_id;
    }

    if (!category_id) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    // Create book
    const book = await Book.create({
      seller_id: userId,
      category_id,
      title,
      author,
      description,
      price,
      condition,
      listing_type: listing_type || 'sell',
      status: 'available',
      city,
      state
    });

    // Handle multiple images upload
    if (req.files && req.files.length > 0) {
      const imageData = req.files.map(file => ({
        book_id: book.book_id,
        image_url: `/uploads/${file.filename}`
      }));
      await BookImage.bulkCreate(imageData);
    }

    const bookWithImages = await Book.findByPk(book.book_id, {
      include: [
        { model: BookImage, as: 'images' },
        { model: BookCategory, as: 'category' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      book: bookWithImages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all books with filters
 */
export const getAllBooks = async (req, res, next) => {
  try {
    const { category_id, condition, status, search, listing_type, city, state, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (category_id) whereClause.category_id = category_id;
    if (condition) whereClause.condition = condition;
    if (status) whereClause.status = status;
    if (listing_type) whereClause.listing_type = listing_type;
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Filter by location if provided
    const userLocationWhere = {};
    if (city) userLocationWhere.city = city;
    if (state) userLocationWhere.state = state;

    const { count, rows } = await Book.findAndCountAll({
      where: whereClause,
      include: [
        { model: BookImage, as: 'images' },
        { model: BookCategory, as: 'category' },
        { 
          model: User, 
          as: 'seller',
          attributes: ['user_id', 'name', 'email', 'profile_image'],
          include: [{
            model: UserLocation,
            as: 'UserLocation',
            where: Object.keys(userLocationWhere).length > 0 ? userLocationWhere : undefined,
            required: Object.keys(userLocationWhere).length > 0
          }]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['uploaded_at', 'DESC']]
    });

    const mappedRows = rows.map(book => {
      const bookData = book.get({ plain: true });
      return {
        ...bookData,
        owner_city: bookData.city || bookData.seller?.UserLocation?.city || null,
        owner_state: bookData.state || bookData.seller?.UserLocation?.state || null
      };
    });

    res.status(200).json({
      success: true,
      data: mappedRows,
      books: mappedRows, // For frontend compatibility
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
 * Get book by ID
 */
export const getBookById = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findByPk(bookId, {
      include: [
        { model: BookImage, as: 'images' },
        { model: BookCategory, as: 'category' },
        { 
          model: User, 
          as: 'seller',
          attributes: ['user_id', 'name', 'email', 'phone', 'profile_image']
        }
      ]
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const bookData = book.get({ plain: true });
    const mappedBook = {
      ...bookData,
      owner_city: bookData.city || bookData.seller?.UserLocation?.city || null,
      owner_state: bookData.state || bookData.seller?.UserLocation?.state || null
    };

    res.status(200).json({
      success: true,
      book: mappedBook
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update book (seller only)
 */
export const updateBook = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { bookId } = req.params;
    const { title, author, description, price, condition, status } = req.body;

    // Check if user is the seller
    const book = await Book.findByPk(bookId);
    if (!book || book.seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Update book
    await book.update({ title, author, description, price, condition, status });

    const updatedBook = await Book.findByPk(bookId, {
      include: [
        { model: BookImage, as: 'images' },
        { model: BookCategory, as: 'category' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete book (seller only)
 */
export const deleteBook = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { bookId } = req.params;

    // Check if user is the seller
    const book = await Book.findByPk(bookId);
    if (!book || book.seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Delete book (cascade will delete images)
    await book.destroy();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get books by seller
 */
export const getBooksBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Book.findAndCountAll({
      where: { seller_id: sellerId },
      include: [
        { model: BookImage, as: 'images' },
        { model: BookCategory, as: 'category' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['uploaded_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: rows,
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
 * Get book categories
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await BookCategory.findAll();

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};
