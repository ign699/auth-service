const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const authMiddle = require('../../auth-middle');

const {
  register, registerValidators,
  login, loginValidators,
  two_factor_login, two_factor_loginValidators,
  two_factor_verify, two_factor_verifyValidators,
  two_factor_enable,
} = require('./controllers');


const {
  AUTH_SECRET,
  VERIFICATION_SECRET_KEY
} = process.env;


router.post('/register', registerValidators, register);

router.post('/login', loginValidators, login);

router.post('/login/two-factor', two_factor_loginValidators, two_factor_login);

router.post('/jwt/validate', async (req, res) => {
  const token = req.headers['x-access-token'];
  try {
    const verfied = await jwt.verify(token, AUTH_SECRET);
    res.send(verfied);
  } catch (e) {
    res.sendStatus(401);
  }
});

router.get('/enable/two-factor', authMiddle , two_factor_enable);

router.post('/verify/two-factor', authMiddle, two_factor_verifyValidators, two_factor_verify);

router.get('/account/verify', async (req, res) => {
  const token = req.query.token;
  try {
    const verfied = await jwt.verify(token, VERIFICATION_SECRET_KEY);
    await User.update({ _id: verfied._id }, { $set: { verified: true }});
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(404);
  }
});



module.exports = router;
