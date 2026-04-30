import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Book from './Book.js';

/**
 * Chat Model
 * Represents a conversation thread between two users about a book
 */
const Chat = sequelize.define('Chat', {
  chat_id: {
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
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  sent_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Chat',
  timestamps: false,
  indexes: [
    {
      fields: ['book_id', 'sender_id', 'receiver_id'],
      unique: true
    }
  ]
});

Chat.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });
Chat.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Chat.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

export default Chat;
