import Disease from '../models/DiseaseModel.js';
import DiseaseCategory from '../models/DiseaseCategoryModel.js';
import DiseaseCategoryLink from '../models/DiseaseCategoryLinkModel.js';
import DiseaseDrug from '../models/DiseaseDrugModel.js';

export const getAllDiseases = async (req, res) => {
  try {
    const diseases = await Disease.findAll({
      attributes: ['name', 'other_name', 'slug', 'excerpt', 'img'],
    });
    res.json(diseases);
  } catch (error) {
    console.log(error);
    res.json({ msg: 'Error fetch data!' });
  }
};

export const getAllDiseasesCategory = async (req, res) => {
  try {
    const diseasescategory = await DiseaseCategory.findAll({
      attributes: ['name', 'slug', 'description'],
    });
    res.json(diseasescategory);
  } catch (error) {
    console.log(error);
    res.json({ msg: 'Error fetch data!' });
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
    res.json({ msg: 'Error fetch data!' });
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
    res.json({ msg: 'Error fetch data!' });
  }
};
