import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

/**
 * UserProfile Model
 * Stores extended profile information
 */
const UserProfile = sequelize.define('UserProfile', {
  profile_id: {
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
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  profile_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  rating_avg: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  }
}, {
  tableName: 'User_Profile',
  timestamps: false
});

UserProfile.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(UserProfile, { foreignKey: 'user_id' });

export default UserProfile;
