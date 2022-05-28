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
          key: req.body.keyword + '%',
          slugkey: slugify(req.body.keyword) + '%',
        },
        type: QueryTypes.SELECT,
      }
    );
    res.json(search);
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
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
        'diseases_other_name',
        'diseases_other_slug',
      ],
    });
    res.json(diseasesdrug);
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};
