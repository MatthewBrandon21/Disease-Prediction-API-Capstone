import Users from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

export const refreshTokenAndroid = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
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
            expiresIn: '15s',
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
