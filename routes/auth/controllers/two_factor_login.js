const notp = require('notp');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const { check, validationResult } = require('express-validator/check');

const two_factor_loginValidators = [
  check('code').exists().isString(),
  check('twoFactorKey').exists().isString(),
];

const {
  AUTH_SECRET,
  TWO_FACTOR_SECRET,
} = process.env;

const two_factor_login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    code,
    twoFactorKey
  } = req.body;
  try {
    const verfied = await jwt.verify(twoFactorKey, TWO_FACTOR_SECRET);
    const { _id } = verfied;
    const user = (await User.findById(_id)).toObject();
    notp.totp.verify(code, user.twoFactorId, { window: 1 });
    delete user.password;
    delete user.twoFactorId;
    const token = jwt.sign({ ...user }, AUTH_SECRET, {
      expiresIn: 86400,
    });
    res.status(200).send({ auth: true, token });
  } catch (e) {
    res.sendStatus(404);
  }
};

module.exports = {
  two_factor_loginValidators,
  two_factor_login
};