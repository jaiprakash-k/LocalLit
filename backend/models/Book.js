import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import BookCategory from './BookCategory.js';

/**
 * Book Model
 * Represents a book for sale or exchange
 */
const Book = sequelize.define('Book', {
  book_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BookCategory,
      key: 'category_id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  listing_type: {
    type: DataTypes.ENUM('sell', 'lend', 'swap'),
    defaultValue: 'sell'
  },
  condition: {
    type: DataTypes.ENUM('new', 'like_new', 'good', 'fair', 'poor'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'sold', 'exchanged', 'pending'),
    defaultValue: 'available'
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'Book',
  timestamps: false
});

Book.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });
Book.belongsTo(BookCategory, { foreignKey: 'category_id', as: 'category' });
User.hasMany(Book, { foreignKey: 'seller_id', as: 'books' });
BookCategory.hasMany(Book, { foreignKey: 'category_id' });

export default Book;
