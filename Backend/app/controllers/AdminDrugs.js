import Drug from '../models/DrugModel.js';
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

export const adminGetAllDrugs = async (req, res) => {
  try {
    const drugs = await Drug.findAll();
    res.json(drugs);
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};

export const AdminGetDrugBySlug = async (req, res) => {
  try {
    const drug = await Drug.findAll({
      where: { slug: req.params.slug },
    });
    res.json(drug[0]);
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};

export const AdminCreateDrug = async (req, res) => {
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
      let slugexist = await Drug.findAll({
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
          slugexist = await Drug.findAll({
            where: {
              slug: slug,
            },
          });
          if (slugexist.length == 0) {
            exit = 1;
          }
        }
      }
      await Drug.create({
        name: req.body.name,
        other_name: req.body.other_name,
        slug: slug,
        description: req.body.description,
        excerpt: req.body.excerpt,
        img: 'https://storage.googleapis.com/diseases-prediction-bucket/diseases-prediction-default-thumbnail.jpg',
      });
      res.json({ message: 'Drugs Created' });
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
          Drug.create({
            name: req.body.name,
            other_name: req.body.other_name,
            slug: slug,
            description: req.body.description,
            excerpt: req.body.excerpt,
            img: publicUrl,
          });
          res.json({ message: 'Drugs Created' });
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

export const AdminUpdateDrug = async (req, res) => {
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
      let slugexist = await Drug.findAll({
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
          slugexist = await Drug.findAll({
            where: {
              slug: slug,
            },
          });
          if (slugexist.length == 0) {
            exit = 1;
          }
        }
      }
      await Drug.update(
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
      res.json({ message: 'Drugs Updated' });
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
          Drug.update(
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
          res.json({ message: 'Drugs Updated' });
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

export const AdminDeleteDrug = async (req, res) => {
  try {
    await Drug.destroy({
      where: {
        slug: req.params.slug,
      },
    });
    res.json({ message: 'Drugs Deleted' });
  } catch (error) {
    console.log(error);
    res.status(404).send('404 Not Found');
  }
};
