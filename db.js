const mongoose = require('mongoose');

const {
  DB_USER,
  DB_PASSWORD,
} = process.env;

mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@ds139992.mlab.com:39992/auth`);

