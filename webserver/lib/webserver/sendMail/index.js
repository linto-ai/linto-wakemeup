const nodemailer = require("nodemailer");
const htmlTemplate = require('./html-template.js')
const plainTextTemplate = require('./plain-text-template.js')

async function send(to, userName, reinitLink){
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE, // true for 465, false for other ports
      requireTLS: process.env.SMTP_REQUIRE_TLS,
      auth: {
        user: process.env.SMTP_AUTH, // generated ethereal user
        pass: process.env.SMTP_PSWD // generated ethereal password
      }
    })

    transporter.verify(function(error, success) {
      if (error) {
        console.error(error);
        return 'mailerTransporterError'
      }
    })

    const htmlMail = htmlTemplate.renderHtmlTemplate(userName, reinitLink)
    const plainTextMail = plainTextTemplate.renderPlainTextTemplate(userName, reinitLink)

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Wakemeup.linto.ai" <noreply@linto.ai>', // sender address
      to: to,
      subject: "Wakemeup.linto.ai - Réinitalisation du mot de passe", // Subject line
      text: plainTextMail, // plain text body
      html: htmlMail
    })
    if(info.accepted.indexOf(to) >= 0) {
      // if email address is "accepted"
      return 'mailSend'
    } else if(info.rejected.indexOf(to) >= 0) {
      // if email address is "rejected"
      return 'mailReject'
    } else {
      return 'mailUnknownError'
    }
  } catch (err) {
    console.error('send mail error:', err)
  }
}

module.exports = {
  send
}

