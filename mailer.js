var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

let receivers = 'mctablang@up.edu.ph, mtablang@gmail.com';

function sendMail(message){
  const mailOptions = {
    from: '"ONE HEALTH PH" <' + process.env.EMAIL + '>', // sender address
    to: receivers, // list of receivers
    subject: 'One Health Crowdsourcing App: Responses of ' + (JSON.parse(message)).facebook_name + ' (' + new Date() + ')', // Subject line
    text: message// plain text body
  };
  
  transporter.sendMail(mailOptions, function (err, info) {
     if(err)
       console.log(err)
     else
       console.log(info);
  });

}

module.exports = sendMail;