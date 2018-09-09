const nodemailer = require('nodemailer');


const {
  MAIL_USER,
  MAIL_PASSWORD,
} = process.env;


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  }
});


const sendMail = (mail, subject, message) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: MAIL_USER,
      to: mail,
      subject,
      text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        reject(error)
      } else {
        resolve(info);
      }
    });
  })
};



module.exports = sendMail;

