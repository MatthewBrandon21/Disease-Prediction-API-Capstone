import { Sequelize } from 'sequelize';
import db from '../../config/database.js';

const { DataTypes } = Sequelize;

const DiseaseDrug = db.define(
  'diseases_drugs',
  {
    drugs_name: {
      type: DataTypes.STRING,
    },
    drugs_slug: {
      type: DataTypes.STRING,
    },
    diseases_name: {
      type: DataTypes.STRING,
    },
    diseases_slug: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default DiseaseDrug;
