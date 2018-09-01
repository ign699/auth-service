const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


const {
  SECRET,
} = process.env;


router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const user = (await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    })).toObject();

    delete user.password;
    const token = jwt.sign(user, SECRET, {
      expiresIn: 86400,
    });
    res.status(200).send({ auth: true, token });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = (await User.findOne({ name: req.body.name })).toObject();
    const authenticated = await bcrypt.compare(req.body.password, user.password);
    if (authenticated) {
      delete user.password;
      const token = jwt.sign(user, SECRET, {
        expiresIn: 86400,
      });
      res.status(200).send({ auth: true, token });
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    res.status(500).send('Couldn\'t authorize');
  }
});

router.post('/verify', async (req, res) => {
  const token = req.headers['x-access-token'];
  try {
    const verfied = await jwt.verify(token, SECRET);
    res.send(verfied);
  } catch (e) {
    res.sendStatus(401);
  }
});

module.exports = router;
