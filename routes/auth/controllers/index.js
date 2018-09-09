const registerController = require('./register');
const loginController = require('./login');
const two_factor_loginController = require('./two_factor_login');
const two_factor_verifyController = require('./two_factor_verify');
const two_factor_enableController = require('./two_factor_enable');


module.exports = {
  ...registerController,
  ...loginController,
  ...two_factor_loginController,
  ...two_factor_verifyController,
  ...two_factor_enableController,
};