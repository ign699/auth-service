const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const cors = require('cors');
const morgan = require('morgan')

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.send('HLLO XDXDDD');
});

app.use('/auth', auth);

module.exports = app;
