const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const { check, validationResult } = require('express-validator/check');

const {
  AUTH_SECRET,
  TWO_FACTOR_SECRET,
} = process.env;

const loginValidators = [
  check('username').exists(),
  check('password').exists(),
];

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }


  let user;
  try {
    user = (await User.findOne({ username: req.body.username })).toObject();
    const authenticated = await bcrypt.compare(req.body.password, user.password);
    if(!authenticated) {
      res.sendStatus(401);
      return;
    }
  } catch (e) {
    console.log(e)
    res.sendStatus(401);
    return;
  }


  delete user.password;
  delete user.twoFactorId;

  if(user.twoFactorEnabled) {
    const token = jwt.sign({ _id: user._id, auth: false }, TWO_FACTOR_SECRET, {
      expiresIn: 300,
    });
    res.status(200).send({ auth: false, twoFactorKey: token });
  } else {
    const token = jwt.sign({ ...user }, AUTH_SECRET, {
      expiresIn: 86400,
    });
    res.status(200).send({ auth: true, token });
  }
};


module.exports =  { login, loginValidators };