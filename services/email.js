require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = function(to, from, subject, html) {
  const msg = {
    to,
    from,
    subject,
    html
  }

  sgMail.send(msg, (err, res) => {
    if(err) {
      console.log('Email not send', err);
    } else {
      console.log('Email send successfully');
    }
  })
}

module.exports = { sendEmail };