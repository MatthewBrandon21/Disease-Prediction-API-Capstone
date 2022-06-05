import Disease from '../models/DiseaseModel.js';
import DiseaseDrug from '../models/DiseaseDrugModel.js';
import DiseaseCategoryLink from '../models/DiseaseCategoryLinkModel.js';
import { Storage } from '@google-cloud/storage';
import { v1 } from 'uuid';
import slugify from 'slugify';
import dotenv from 'dotenv';

dotenv.config();

const uuidv1 = v1;

const storage = new Storage({
  projectid: process.env.GCLOUD_PROJECT,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY,
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET);

export const adminGetAllDiseases = async (req, res) => {
  try {
    const diseases = await Disease.findAll();
    res.json(diseases);
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};

export const AdminGetDiseaseBySlug = async (req, res) => {
  try {
    const disease = await Disease.findAll({
      where: { slug: req.params.slug },
      include: [
        {
          model: DiseaseDrug,
        },
      ],
    });
    res.json(disease[0]);
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};

export const AdminCreateDisease = async (req, res) => {
  var filesize = '';
  try {
    filesize = req.file.size;
  } catch {
    filesize = '';
  }
  if (filesize === '') {
    try {
      let itteration = 1;
      let slug = slugify(req.body.name);
      let slugexist = await Disease.findAll({
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
          slugexist = await Disease.findAll({
            where: {
              slug: slug,
            },
          });
          if (slugexist.length == 0) {
            exit = 1;
          }
        }
      }
      await Disease.create({
        name: req.body.name,
        other_name: req.body.other_name,
        slug: slug,
        description: req.body.description,
        excerpt: req.body.excerpt,
        img: 'https://storage.googleapis.com/diseases-prediction-bucket/diseases-prediction-default-thumbnail.jpg',
      });
      res.json({ message: 'Disease Created' });
    } catch (error) {
      console.log(error);
      res.status(404).send('404 Not Found');
    }
  } else {
    try {
      const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
      const array_of_allowed_file_types = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
      ];
      const allowed_file_size = 5;

      const file_extension = req.file.originalname.slice(
        ((req.file.originalname.lastIndexOf('.') - 1) >>> 0) + 2
      );
      if (!array_of_allowed_files.includes(file_extension)) {
        return res.status(400).send('Invalid file');
      }

      if (req.file.size / (1024 * 1024) > allowed_file_size) {
        return res.status(400).send('File too large');
      }

      const newFileName = uuidv1() + '-' + req.file.originalname;
      const blob = bucket.file(newFileName);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => console.log(err));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
        const slug = slugify(req.body.name) + '-' + uuidv1();
        try {
          Disease.create({
            name: req.body.name,
            other_name: req.body.other_name,
            slug: slug,
            description: req.body.description,
            excerpt: req.body.excerpt,
            img: publicUrl,
          });
          res.json({ message: 'Disease Created' });
        } catch (error) {
          console.log(error);
          res.status(404).send('404 Not Found');
        }
      });
      blobStream.end(req.file.buffer);
    } catch (error) {
      console.log(error);
      res.status(404).send('404 Not Found');
    }
  }
};

export const AdminUpdateDisease = async (req, res) => {
  var filesize = '';
  try {
    filesize = req.file.size;
  } catch {
    filesize = '';
  }
  if (filesize === '') {
    try {
      let itteration = 1;
      let slug = slugify(req.body.name);
      let slugexist = await Disease.findAll({
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
          slugexist = await Disease.findAll({
            where: {
              slug: slug,
            },
          });
          if (slugexist.length == 0) {
            exit = 1;
          }
        }
      }
      await Disease.update(
        {
          name: req.body.name,
          other_name: req.body.other_name,
          slug: slug,
          description: req.body.description,
          excerpt: req.body.excerpt,
        },
        {
          where: {
            slug: req.params.slug,
          },
        }
      );
      res.json({ message: 'Disease Updated' });
    } catch (error) {
      console.log(error);
      res.status(404).send('404 Not Found');
    }
  } else {
    try {
      const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
      const array_of_allowed_file_types = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
      ];
      const allowed_file_size = 5;

      const file_extension = req.file.originalname.slice(
        ((req.file.originalname.lastIndexOf('.') - 1) >>> 0) + 2
      );
      if (!array_of_allowed_files.includes(file_extension)) {
        return res.status(400).send('Invalid file');
      }

      if (req.file.size / (1024 * 1024) > allowed_file_size) {
        return res.status(400).send('File too large');
      }

      const newFileName = uuidv1() + '-' + req.file.originalname;
      const blob = bucket.file(newFileName);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => console.log(err));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
        const slug = slugify(req.body.name) + '-' + uuidv1();
        try {
          Disease.update(
            {
              name: req.body.name,
              other_name: req.body.other_name,
              slug: slug,
              description: req.body.description,
              excerpt: req.body.excerpt,
              img: publicUrl,
            },
            {
              where: {
                slug: req.params.slug,
              },
            }
          );
          res.json({ message: 'Disease Updated' });
        } catch (error) {
          console.log(error);
          res.status(404).send('404 Not Found');
        }
      });
      blobStream.end(req.file.buffer);
    } catch (error) {
      console.log(error);
      res.status(404).send('404 Not Found');
    }
  }
};

export const AdminDeleteDisease = async (req, res) => {
  try {
    const diseasecategoryexist = await DiseaseCategoryLink.findAll({
      where: {
        disease_slug: req.params.slug,
      },
    });
    if (diseasecategoryexist.length > 0) {
      return res.status(400).send('Disease used by disease category');
    }
    const diseasedrugexist = await DiseaseDrug.findAll({
      where: {
        diseases_slug: req.params.slug,
      },
    });
    if (diseasedrugexist.length > 0) {
      return res.status(400).send('Disease used by disease drug');
    }
    await Disease.destroy({
      where: {
        slug: req.params.slug,
      },
    });
    res.json({ message: 'Disease Deleted' });
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};
