const crypto = require('crypto');
const base32 = require('thirty-two');


const two_factor_enable = async (req, res) => {
  crypto.randomBytes(32, async (err, buf) => {
    if (err) throw err;
    const key = buf.toString('utf-8');
    const encoded = base32.encode(key);
    const encodedForGoogle = encoded.toString().replace(/=/g,'');
    res.send({link: 'otpauth://totp/authApp?secret=' + encodedForGoogle, key: key});
  });
};

module.exports = {
  two_factor_enable
};