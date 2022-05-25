import Drug from '../models/DrugModel.js';

export const getAllDrugs = async (req, res) => {
  try {
    const drugs = await Drug.findAll({
      attributes: ['name', 'other_name', 'slug', 'excerpt', 'img'],
    });
    res.json(drugs);
  } catch (error) {
    console.log(error);
    res.json({ msg: 'Error fetch data!' });
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
    res.json({ msg: 'Error fetch data!' });
  }
};
