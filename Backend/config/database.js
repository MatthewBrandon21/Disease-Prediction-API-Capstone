import { Sequelize } from 'sequelize';

const db = new Sequelize('diseases_prediction_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;
