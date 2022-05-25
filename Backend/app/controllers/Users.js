import Users from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: [
        'id',
        'email',
        'username',
        'name',
        'address',
        'phonenum',
        'birthdate',
        'img',
        'isactive',
        'role',
      ],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  const { email, username, name, password, confpassword } = req.body;
  if (password !== confpassword)
    return res.status(400).json({ msg: 'Password Not Match!' });
  const salt = await bcrypt.genSalt();
  const hashpassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      email: email,
      name: name,
      username: username,
      password: hashpassword,
    });
    res.json({ msg: 'Register success!' });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
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
    const accessToken = jwt.sign(
      { userId, email, username, name, address, phonenum, birthdate, img },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '20s',
      }
    );
    const refreshToken = jwt.sign(
      { userId, email, username, name, address, phonenum, birthdate, img },
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
    res.json({ accessToken });
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
