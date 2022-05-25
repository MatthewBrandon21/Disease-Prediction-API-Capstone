import { Sequelize } from 'sequelize';
import db from '../../config/database.js';

const { DataTypes } = Sequelize;

const Users = db.define(
  'users',
  {
    email: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    phonenum: {
      type: DataTypes.STRING,
    },
    birthdate: {
      type: DataTypes.STRING,
    },
    img: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    isactive: {
      type: DataTypes.INTEGER,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Users;
