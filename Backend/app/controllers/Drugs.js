import Drug from '../models/DrugModel.js';
import { Op, QueryTypes } from 'sequelize';
import db from '../../config/database.js';
import slugify from 'slugify';

export const getAllDrugs = async (req, res) => {
  try {
    const drugs = await Drug.findAll({
      attributes: ['name', 'other_name', 'slug', 'excerpt', 'img', 'updatedAt'],
    });
    res.json(drugs);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: '404 Not Found' });
  }
};

export const getDrugBySlug = async (req, res) => {
  try {
    const drug = await Drug.findAll({
      where: { slug: req.params.slug },
      attributes: [
        'name',
        'other_name',
        'slug',
        'description',
        'excerpt',
        'img',
        'createdAt',
        'updatedAt',
      ],
    });
    res.json(drug);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: '404 Not Found' });
  }
};

export const SearchDrugs = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  try {
    const search = await db.query(
      'SELECT * FROM drugs WHERE slug LIKE :key OR slug LIKE :slugkey OR name LIKE :key OR other_name LIKE :key',
      {
        replacements: {
          key: '%' + req.body.keyword + '%',
          slugkey: '%' + slugify(req.body.keyword) + '%',
        },
        type: QueryTypes.SELECT,
      }
    );
    res.json(search);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: '404 Not Found' });
  }
};
