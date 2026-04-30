import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Exchange from './Exchange.js';
import Book from './Book.js';

/**
 * ExchangeBook Model
 * Maps books being offered and requested in an exchange
 */
const ExchangeBook = sequelize.define('ExchangeBook', {
  exchange_book_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  exchange_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Exchange,
      key: 'exchange_id'
    }
  },
  offered_book_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Book,
      key: 'book_id'
    }
  },
  requested_book_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'book_id'
    }
  }
}, {
  tableName: 'Exchange_Books',
  timestamps: false
});

ExchangeBook.belongsTo(Exchange, { foreignKey: 'exchange_id', as: 'exchange' });
ExchangeBook.belongsTo(Book, { foreignKey: 'offered_book_id', as: 'offeredBook' });
ExchangeBook.belongsTo(Book, { foreignKey: 'requested_book_id', as: 'requestedBook' });

Exchange.hasMany(ExchangeBook, { foreignKey: 'exchange_id', as: 'exchangeBooks' });

export default ExchangeBook;
