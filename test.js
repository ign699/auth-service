var base32 = require('thirty-two');
var crypto = require('crypto');



crypto.randomBytes(32, (err, buf) => {
  if (err) throw err;
  const key = buf.toString('utf8');
  const encoded = base32.encode(key);
  const encodedForGoogle = encoded.toString().replace(/=/g,'');

  console.log('otpauth://totp/somelabel?secret=' + encodedForGoogle);
});


