import Joi from 'joi';

export const userregistervalidation = (data) => {
  const schemauser = Joi.object({
    email: Joi.string().required().email(),
    username: Joi.string().required(),
    name: Joi.string().required(),
    address: Joi.string(),
    phonenum: Joi.string(),
    birthdate: Joi.string(),
    img: Joi.string(),
    password: Joi.string().min(6).required(),
    confpassword: Joi.string().min(6).required(),
  });
  return schemauser.validate(data);
};

export const userloginvalidation = (data) => {
  const schemauser = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schemauser.validate(data);
};

export const userupdatevalidation = (data) => {
  const schemauser = Joi.object({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    address: Joi.string(),
    phonenum: Joi.string(),
    birthdate: Joi.string(),
    img: Joi.string(),
  });
  return schemauser.validate(data);
};

export const userpasswordvalidation = (data) => {
  const schemauser = Joi.object({
    email: Joi.string().min(6).required(),
    oldpassword: Joi.string().min(6).required(),
    newpassword: Joi.string().min(6).required(),
    confpassword: Joi.string().min(6).required(),
  });
  return schemauser.validate(data);
};
