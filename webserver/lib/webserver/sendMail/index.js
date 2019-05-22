const nodemailer = require("nodemailer");

async function sendReinitPasswordMail(to, userName, reinitLink){
  try {
    const htmlTemplate = require('./html-reinit-template.js')
    const plainTextTemplate = require('./plain-text-reinit-template.js')

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
      from: `"Wakemeup.linto.ai" <${process.env.NO_REPLY_EMAIL}>`, // sender address
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

async function sendContactMail(payload){
  try {
    const htmlTemplate = require('./html-contact-template.js')
    const plainTextTemplate = require('./plain-text-contact-template.js')
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

    const to = process.env.CONTACT_EMAIL
    const htmlMail = htmlTemplate.renderHtmlTemplate(payload)
    const plainTextMail = plainTextTemplate.renderPlainTextTemplate(payload)

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Wakemeup.linto.ai" <${process.env.NO_REPLY_EMAIL}>`, // sender address
      to: to,
      subject: `Wakemeup.linto.ai - Contact - ${payload.subject}`, // Subject line
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
  sendContactMail,
  sendReinitPasswordMail
}
