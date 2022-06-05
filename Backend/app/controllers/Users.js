import Users from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  userregistervalidation,
  userloginvalidation,
  userupdatevalidation,
  userpasswordvalidation,
} from '../../middleware/FormValidation.js';
import { Storage } from '@google-cloud/storage';
import { v1 } from 'uuid';
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

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({});
    res.json(users);
  } catch (error) {
    res.status(404).json({ msg: '404 Not Found' });
  }
};

export const Register = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  const { error } = userregistervalidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });
  const {
    email,
    username,
    name,
    address,
    phonenum,
    birthdate,
    password,
    confpassword,
  } = req.body;
  if (password !== confpassword)
    return res.status(400).json({ msg: 'Password Not Match!' });
  const emailexist = await Users.findAll({
    where: {
      email: email,
    },
  });
  if (emailexist.length > 0) {
    return res.status(400).json({ msg: 'Email already exist' });
  }
  const usernameexist = await Users.findAll({
    where: {
      username: username,
    },
  });
  if (usernameexist.length > 0) {
    return res.status(400).json({ msg: 'Username already exist' });
  }
  const salt = await bcrypt.genSalt();
  const hashpassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      email: email,
      username: username,
      name: name,
      address: address,
      phonenum: phonenum,
      birthdate: birthdate,
      img: 'https://storage.googleapis.com/diseases-prediction-bucket/default-user-icon.jpg',
      password: hashpassword,
    });
    res.json({ msg: 'Register success!' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: err });
  }
};

export const Login = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  const { error } = userloginvalidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    if (user[0].isactive == 0) {
      return res
        .sendStatus(403)
        .json({ msg: 'Account banned, please contact administrator' });
    }
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: 'Wrong Password!' });
    const userId = user[0].id;
    const email = user[0].email;
    const username = user[0].username;
    const name = user[0].name;
    const address = user[0].address;
    const phonenum = user[0].phonenum;
    const birthdate = user[0].birthdate;
    const img = user[0].img;
    const isactive = user[0].isactive;
    const role = user[0].role;
    const accessToken = jwt.sign(
      {
        userId,
        email,
        username,
        name,
        address,
        phonenum,
        birthdate,
        img,
        isactive,
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '20s',
      }
    );
    const refreshToken = jwt.sign(
      {
        userId,
        email,
        username,
        name,
        address,
        phonenum,
        birthdate,
        img,
        isactive,
        role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true,
    });
    res.json({ user, accessToken });
  } catch (error) {
    res.status(404).json({ msg: 'Email not found!' });
  }
};

export const AndroidLogin = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  const { error } = userloginvalidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    if (user[0].isactive == 0) {
      return res
        .sendStatus(403)
        .json({ msg: 'Account banned, please contact administrator' });
    }
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: 'Wrong Password!' });
    const userId = user[0].id;
    const email = user[0].email;
    const username = user[0].username;
    const name = user[0].name;
    const address = user[0].address;
    const phonenum = user[0].phonenum;
    const birthdate = user[0].birthdate;
    const img = user[0].img;
    const isactive = user[0].isactive;
    const role = user[0].role;
    const accessToken = jwt.sign(
      {
        userId,
        email,
        username,
        name,
        address,
        phonenum,
        birthdate,
        img,
        isactive,
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '20s',
      }
    );
    const refreshToken = jwt.sign(
      {
        userId,
        email,
        username,
        name,
        address,
        phonenum,
        birthdate,
        img,
        isactive,
        role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true,
    });
    res.json({ user, accessToken, refreshToken });
  } catch (error) {
    res.status(404).json({ msg: 'Email not found!' });
  }
};

export const LoginAdmin = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  const { error } = userloginvalidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    if (user[0].isactive == 0) {
      return res
        .sendStatus(403)
        .json({ msg: 'Account banned, please contact administrator' });
    }
    if (user[0].role.includes('user')) {
      return res.sendStatus(403).json({ msg: 'Only for administrator' });
    }
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: 'Wrong Password!' });
    const userId = user[0].id;
    const email = user[0].email;
    const username = user[0].username;
    const name = user[0].name;
    const address = user[0].address;
    const phonenum = user[0].phonenum;
    const birthdate = user[0].birthdate;
    const img = user[0].img;
    const isactive = user[0].isactive;
    const role = user[0].role;
    const accessToken = jwt.sign(
      {
        userId,
        email,
        username,
        name,
        address,
        phonenum,
        birthdate,
        img,
        isactive,
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '20s',
      }
    );
    const refreshToken = jwt.sign(
      {
        userId,
        email,
        username,
        name,
        address,
        phonenum,
        birthdate,
        img,
        isactive,
        role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true,
    });
    res.json({ user, accessToken });
  } catch (error) {
    res.status(404).json({ msg: 'Email not found!' });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

export const Update = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  const { error } = userupdatevalidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });
  const { email, name, address, phonenum, birthdate } = req.body;
  try {
    const user = await Users.findAll({
      where: {
        email: email,
      },
    });
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    const detected = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        if (decoded.email != user[0].email) {
          return true;
        }
      }
    );
    if (detected) {
      return res.sendStatus(403);
    }
    try {
      await Users.update(
        {
          name: name,
          address: address,
          phonenum: phonenum,
          birthdate: birthdate,
        },
        {
          where: {
            id: user[0].id,
          },
        }
      );
      res.json({ msg: 'Update user success!' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: err });
    }
  } catch (error) {
    res.status(404).json({ msg: 'Email not found!' });
  }
};

export const UpdateProfilePicture = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findAll({
      where: {
        email: email,
      },
    });
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    const detected = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        if (decoded.email != user[0].email) {
          return true;
        }
      }
    );
    if (detected) {
      return res.sendStatus(403);
    }
  } catch (error) {
    res.status(404).json({ msg: 'Email not found!' });
  }
  var filesize = '';
  try {
    filesize = req.file.size;
  } catch {
    filesize = '';
  }
  if (filesize === '') {
    try {
      res.status(400).json({ msg: 'Photo not found' });
    } catch (error) {
      console.log(error);
      res.status(404).json({ msg: '404 Not Found' });
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
        return res.status(400).json({ msg: 'Invalid file' });
      }

      if (req.file.size / (1024 * 1024) > allowed_file_size) {
        return res.status(400).json({ msg: 'File too large' });
      }

      const newFileName = uuidv1() + '-' + req.file.originalname;
      const blob = bucket.file(newFileName);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => console.log(err));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
        try {
          Users.update(
            {
              img: publicUrl,
            },
            {
              where: {
                email: email,
              },
            }
          );
          res.json({ message: 'Profile Picture Updated' });
        } catch (error) {
          console.log(error);
          res.status(404).json({ msg: '404 Not Found' });
        }
      });
      blobStream.end(req.file.buffer);
    } catch (error) {
      console.log(error);
      res.status(404).json({ msg: '404 Not Found' });
    }
  }
};

export const UpdatePassword = async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ msg: 'Request body not match' });
  }
  const { error } = userpasswordvalidation(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });
  const { email, oldpassword, newpassword, confpassword } = req.body;
  if (newpassword !== confpassword)
    return res.status(400).json({ msg: 'Password Not Match!' });
  try {
    const user = await Users.findAll({
      where: {
        email: email,
      },
    });
    const match = await bcrypt.compare(oldpassword, user[0].password);
    if (!match) return res.status(400).json({ msg: 'Wrong Old Password!' });
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    const detected = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        if (decoded.email != user[0].email) {
          return true;
        }
      }
    );
    if (detected) {
      return res.sendStatus(403);
    }
    try {
      const salt = await bcrypt.genSalt();
      const hashpassword = await bcrypt.hash(newpassword, salt);
      await Users.update(
        {
          password: hashpassword,
        },
        {
          where: {
            id: user[0].id,
          },
        }
      );
      res.json({ msg: 'Update password success!' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: err });
    }
  } catch (error) {
    res.status(404).json({ msg: 'Email not found!' });
  }
};

export const banUser = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.params.email,
      },
    });
    try {
      await Users.update(
        {
          isactive: 0,
        },
        {
          where: {
            id: user[0].id,
          },
        }
      );
      res.json({ msg: 'Banned user success!' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: err });
    }
  } catch (error) {
    res.status(404).json({ msg: 'Email not found!' });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.params.email,
      },
    });
    try {
      await Users.update(
        {
          isactive: 1,
        },
        {
          where: {
            id: user[0].id,
          },
        }
      );
      res.json({ msg: 'Unbanned user success!' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: err });
    }
  } catch (error) {
    res.status(404).json({ msg: 'Email not found!' });
  }
};

export const MakeAdmin = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.params.email,
      },
    });
    try {
      await Users.update(
        {
          role: 'admin',
        },
        {
          where: {
            id: user[0].id,
          },
        }
      );
      res.json({ msg: 'Change role user to admin success!' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: err });
    }
  } catch (error) {
    res.status(404).json({ msg: 'Email not found!' });
  }
};

export const MakeUser = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.params.email,
      },
    });
    try {
      await Users.update(
        {
          role: 'user',
        },
        {
          where: {
            id: user[0].id,
          },
        }
      );
      res.json({ msg: 'Change role user to user success!' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: err });
    }
  } catch (error) {
    res.status(404).json({ msg: 'Email not found!' });
  }
};
