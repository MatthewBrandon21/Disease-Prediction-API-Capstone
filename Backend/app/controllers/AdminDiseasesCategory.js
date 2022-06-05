import DiseaseCategory from '../models/DiseaseCategoryModel.js';
import DiseaseCategoryLink from '../models/DiseaseCategoryLinkModel.js';
import slugify from 'slugify';

export const adminGetAllDiseasesCategory = async (req, res) => {
  try {
    const diseasescategory = await DiseaseCategory.findAll();
    res.json(diseasescategory);
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};

export const adminGetDiseasesCategoryBySlug = async (req, res) => {
  try {
    const diseasescategory = await DiseaseCategory.findAll({
      where: { slug: req.params.slug },
      attributes: ['name', 'slug', 'description', 'createdAt', 'updatedAt'],
    });
    res.json(diseasescategory);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: '404 Not Found' });
  }
};

export const adminGetDiseasesCategoryLink = async (req, res) => {
  try {
    const diseasescategorylink = await DiseaseCategoryLink.findAll({
      where: { disease_category_slug: req.params.slug },
    });
    res.json(diseasescategorylink);
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};

export const adminCreateDiseasesCategory = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  let slug = slugify(req.body.name);
  let slugexist = await DiseaseCategory.findAll({
    where: {
      slug: slug,
    },
  });
  if (slugexist.length > 0) {
    let exit = 0;
    let baseslug = slug;
    while (exit == 0) {
      slug = baseslug + '-' + itteration;
      itteration++;
      slugexist = await DiseaseCategory.findAll({
        where: {
          slug: slug,
        },
      });
      if (slugexist.length == 0) {
        exit = 1;
      }
    }
  }
  try {
    await DiseaseCategory.create({
      name: req.body.name,
      slug: slug,
      description: req.body.description,
    });
    res.json({ message: 'Disease Category Created' });
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};

export const adminCreateDiseasesCategoryLink = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  try {
    await DiseaseCategoryLink.create(req.body);
    res.json({ message: 'Disease Category Link Created' });
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};

export const adminUpdateDiseasesCategory = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  let slug = slugify(req.body.name);
  let slugexist = await DiseaseCategory.findAll({
    where: {
      slug: slug,
    },
  });
  if (slugexist.length > 0) {
    let exit = 0;
    let baseslug = slug;
    while (exit == 0) {
      slug = baseslug + '-' + itteration;
      itteration++;
      slugexist = await DiseaseCategory.findAll({
        where: {
          slug: slug,
        },
      });
      if (slugexist.length == 0) {
        exit = 1;
      }
    }
  }
  try {
    await DiseaseCategory.update(
      {
        name: req.body.name,
        slug: slug,
        description: req.body.description,
      },
      {
        where: {
          slug: req.params.slug,
        },
      }
    );
    res.json({ message: 'Disease Category Updated' });
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};

export const adminUpdateDiseasesCategoryLink = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  try {
    await DiseaseCategoryLink.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: 'Disease Category Link Updated' });
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};

export const adminDeleteDiseasesCategory = async (req, res) => {
  try {
    const diseasecategoryexist = await DiseaseCategoryLink.findAll({
      where: {
        disease_category_slug: req.params.slug,
      },
    });
    if (diseasecategoryexist.length > 0) {
      return res.status(400).send('Disease category used by category link');
    }
    await DiseaseCategory.destroy({
      where: {
        slug: req.params.slug,
      },
    });
    res.json({ message: 'Disease Category Deleted' });
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};

export const adminDeleteDiseasesCategoryLink = async (req, res) => {
  try {
    await DiseaseCategoryLink.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: 'Disease Category Link Deleted' });
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};
