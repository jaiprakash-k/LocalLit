import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

/**
 * UserLocation Model
 * Stores user location information
 */
const UserLocation = sequelize.define('UserLocation', {
  location_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'user_id'
    }
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
  tableName: 'User_Location',
  timestamps: false
});

UserLocation.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(UserLocation, { foreignKey: 'user_id' });

export default UserLocation;
