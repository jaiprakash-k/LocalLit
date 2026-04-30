import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * BookCategory Model
 * Represents book categories/genres
 */
const BookCategory = sequelize.define('BookCategory', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'Book_Category',
  timestamps: false
});

export default BookCategory;
