import Disease from '../models/DiseaseModel.js';
import DiseaseCategory from '../models/DiseaseCategoryModel.js';
import DiseaseCategoryLink from '../models/DiseaseCategoryLinkModel.js';
import DiseaseDrug from '../models/DiseaseDrugModel.js';
import { Op, QueryTypes } from 'sequelize';
import db from '../../config/database.js';
import slugify from 'slugify';

export const getAllDiseases = async (req, res) => {
  try {
    const diseases = await Disease.findAll({
      attributes: ['name', 'other_name', 'slug', 'excerpt', 'img', 'updatedAt'],
    });
    res.json(diseases);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: '404 Not Found' });
  }
};

export const getAllDiseasesCategory = async (req, res) => {
  try {
    const diseasescategory = await DiseaseCategory.findAll({
      attributes: ['name', 'slug', 'description', 'updatedAt'],
    });
    res.json(diseasescategory);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: '404 Not Found' });
  }
};

export const getDiseasesCategoryLink = async (req, res) => {
  try {
    const diseasescategorylink = await DiseaseCategoryLink.findAll({
      where: { disease_category_slug: req.params.slug },
      attributes: ['disease_name', 'disease_slug', 'disease_category_slug'],
    });
    res.json(diseasescategorylink);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: '404 Not Found' });
  }
};

export const getDiseaseBySlug = async (req, res) => {
  try {
    const diseases = await Disease.findAll({
      where: { slug: req.params.slug },
      include: [
        {
          model: DiseaseDrug,
        },
      ],
    });
    res.json(diseases);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: '404 Not Found' });
  }
};

export const SearchDiseases = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  try {
    const search = await db.query(
      'SELECT * FROM diseases WHERE slug LIKE :key OR slug LIKE :slugkey OR name LIKE :key OR other_name LIKE :key',
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
