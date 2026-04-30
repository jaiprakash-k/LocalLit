import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Book from './Book.js';

/**
 * BookImage Model
 * Stores image URLs for books
 */
const BookImage = sequelize.define('BookImage', {
  image_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'book_id'
    }
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Book_Images',
  timestamps: false
});

BookImage.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });
Book.hasMany(BookImage, { foreignKey: 'book_id', as: 'images' });

export default BookImage;
