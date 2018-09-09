const notp = require('notp');
const User = require('../../../models/User');
const { check, validationResult } = require('express-validator/check');

const two_factor_verifyValidators = [
  check('code').exists().isString(),
  check('key').exists().isString(),
];


const two_factor_verify = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const {
    code,
    key,
  } = req.body;

  const resp = notp.totp.verify(code, key, {window: 1});
  if(resp) {
    await User.update({ _id: req.user._id }, { $set: { twoFactorId: key, twoFactorEnabled: true }});
    res.send('Two factor activated !')
  } else {
    res.status(404).send('Wrong Code')
  }
};

module.exports = {
  two_factor_verifyValidators,
  two_factor_verify
};