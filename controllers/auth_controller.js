require('dotenv').config();

const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const user_uc = require('../usecase/user');
const res_data = require('../utilities/response_data');

const register = async (req, res, next) => {
  try {
    const user = {
      name: req.body.name,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      is_admin: false,
    };

    // get username by username in db
    const get_user_by_username = await user_uc.getUserByUsername(user.username);

    // check username is existing
    if (get_user_by_username !== null) {
      return res
        .status(400)
        .json(res_data.failed('Username already exists', null));
    }

    // create user in db
    await user_uc.createUser(user);

    // delete password in object user
    delete user['password'];
    delete user['is_admin'];

    // success create user
    res.status(201).json(res_data.success(user));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password,
    };

    //get user by username in db
    const get_user = await user_uc.getUserByUsername(user.username);

    // check username is incorrect
    if (!get_user) {
      return res
        .status(400)
        .json(res_data.failed('incorrect username or password', null));
    }

    //compare password bycript and password (body req)
    const check_password = bcrypt.compareSync(user.password, get_user.password);

    // check password is incorrect
    if (!check_password) {
      return res
        .status(400)
        .json(res_data.failed('incorrect username or password', null));
    }

    // response data user
    let res_data_user = {
      name: get_user.name,
      username: get_user.username,
      is_admin: get_user.is_admin,
    };

    // create token with expired 1 day
    const json_token = sign(
      { result: res_data_user },
      process.env.JWT_KEY_SECRET,
      {
        expiresIn: '6h',
      },
    );

    //login success
    res.json(res_data.success({ id: get_user.id, token: json_token }));
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };