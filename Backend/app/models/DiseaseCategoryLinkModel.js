import { Sequelize } from 'sequelize';
import db from '../../config/database.js';

const { DataTypes } = Sequelize;

const DiseaseCategoryLink = db.define(
  'diseases_categories_link',
  {
    disease_name: {
      type: DataTypes.STRING,
    },
    disease_slug: {
      type: DataTypes.STRING,
    },
    disease_category_slug: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default DiseaseCategoryLink;
