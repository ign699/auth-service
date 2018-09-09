const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailSender = require('../helpers/mailhelper');
const User = require('../../../models/User');
const { check, validationResult } = require('express-validator/check');

const {
  AUTH_SECRET,
  VERIFICATION_SECRET_KEY,
} = process.env;

const registerValidators = [
  check('username').exists().isLength({ min: 1}),
  check('password').exists().isLength({ min: 1}),
  check('email').exists().isEmail().isLength({ min: 1})
];

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }


  const hashedPassword = await bcrypt.hash(req.body.password, 8);
  let user;
  try {
    user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
  } catch (e) {
    console.log(e)
    let path = e.errmsg.match(/(username|email)/)[0];
    let type = 'unique';
    res.status(409).send({ type, path });
    return
  }

  user = user.toObject();
  delete user.password;

  const verificationToken = jwt.sign({ _id: user._id, email: user.email }, VERIFICATION_SECRET_KEY, {
    expiresIn: 86400,
  });

  await mailSender(user.email, `Your verification link ${user.username}`, `http://localhost:3000/auth/account/verify?token=${verificationToken}`);

  const token = jwt.sign(user, AUTH_SECRET, {
    expiresIn: 86400,
  });
  res.status(200).send({ auth: true, token });
};

module.exports =  { register, registerValidators };