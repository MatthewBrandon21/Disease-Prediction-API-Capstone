import DiseaseDrug from '../models/DiseaseDrugModel.js';
import { Op, QueryTypes } from 'sequelize';
import db from '../../config/database.js';
import slugify from 'slugify';

export const Search = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  try {
    const search = await db.query(
      'SELECT * FROM diseases WHERE slug LIKE :key OR slug LIKE :slugkey OR name LIKE :key OR other_name LIKE :key UNION SELECT * FROM drugs WHERE slug LIKE :key OR slug LIKE :slugkey OR name LIKE :key OR other_name LIKE :key',
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

export const getDiseaseDrugBySlug = async (req, res) => {
  try {
    const diseasesdrug = await DiseaseDrug.findAll({
      where: {
        [Op.or]: [
          {
            diseases_slug: {
              [Op.eq]: req.params.slug,
            },
          },
          {
            diseases_other_slug: {
              [Op.eq]: req.params.slug,
            },
          },
          {
            drugs_slug: {
              [Op.eq]: req.params.slug,
            },
          },
        ],
      },
      attributes: [
        'drugs_name',
        'drugs_slug',
        'diseases_name',
        'diseases_slug',
      ],
    });
    res.json(diseasesdrug);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: '404 Not Found' });
  }
};

export const DiseaseDrug_drug = async (req, res) => {
  try {
    const diseasesdrug = await db.query(
      'SELECT * FROM diseases_drugs JOIN drugs ON diseases_drugs.drugs_slug = drugs.slug',
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json(diseasesdrug);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: '404 Not Found' });
  }
};

export const DiseaseDrug_drugSpesific = async (req, res) => {
  try {
    const diseasesdrug = await db.query(
      'SELECT diseases_drugs.diseases_name, diseases_drugs.diseases_slug, drugs.name, drugs.other_name, drugs.slug, drugs.excerpt, drugs.img FROM diseases_drugs JOIN drugs ON diseases_drugs.drugs_slug = drugs.slug WHERE diseases_drugs.diseases_slug LIKE :slugkey OR diseases_drugs.diseases_name LIKE :key',
      {
        replacements: {
          key: '%' + req.params.slug + '%',
          slugkey: '%' + slugify(req.params.slug) + '%',
        },
        type: QueryTypes.SELECT,
      }
    );
    res.json(diseasesdrug);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: '404 Not Found' });
  }
};

export const adminCreateDiseasesDrugs = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  try {
    await DiseaseDrug.create(req.body);
    res.json({ message: 'Disease Drugs Created' });
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};
