import { Sequelize } from 'sequelize';
import db from '../../config/database.js';

const { DataTypes } = Sequelize;

const Disease = db.define(
  'diseases',
  {
    name: {
      type: DataTypes.STRING,
    },
    other_name: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    excerpt: {
      type: DataTypes.TEXT,
    },
    img: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Disease;
