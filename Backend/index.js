import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from './config/database.js';
import router from './app/routes/index.js';
import Disease from './app/models/DiseaseModel.js';
import DiseaseDrug from './app/models/DiseaseDrugModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

try {
  await db.authenticate();
  console.log('Database Connected!');
  Disease.hasMany(DiseaseDrug, {
    foreignKey: 'diseases_slug',
    sourceKey: 'slug',
    onDelete: 'cascade',
  });
  DiseaseDrug.belongsTo(Disease, {
    foreignKey: 'diseases_slug',
  });
} catch (error) {
  console.log('Connection error: ', error);
}

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
