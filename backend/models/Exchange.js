import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

/**
 * Exchange Model
 * Represents a book exchange request between two users
 */
const Exchange = sequelize.define('Exchange', {
  exchange_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  requester_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  exchange_status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  exchange_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Exchange',
  timestamps: false
});

Exchange.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Exchange.belongsTo(User, { foreignKey: 'requester_id', as: 'requester' });

export default Exchange;
