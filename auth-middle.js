const jwt = require('jsonwebtoken');

const {
  AUTH_SECRET,
} = process.env;



const middle = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  try {
    const verfied = await jwt.verify(token, AUTH_SECRET);
    req.user = verfied;
    next();
  } catch (e) {
    res.sendStatus(401);
  }
};


module.exports = middle;