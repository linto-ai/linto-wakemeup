function renderHtmlTemplate (user, reinitLink) {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Password Reset</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          body{
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
          }
          #mail-wrapper{
            width: 100%;
            background-color: #f2f2f2;
            text-align:center;
          }
          table{
            width: 100%;
            max-width: 960px;
            min-width: 320px;
            border: none;
            border-collapse: collapse !important;
            margin: 0 auto;
          }
          
          #mail-header{
            background-color: #f2f2f2;
          }
          .logo{
            display: inline-block;
            max-height: 100px;
            width: auto;
            margin: 0 10px;
          }

          #mail-body {
            padding: 20px;
            background-color: #ffffff;
          }
          .mail-title{
            font-size: 22px;
            font-weight: 600;
            color: #444444;
            text-align: center;
            padding: 40px 0 20px 0;
          }
          td.mail-content{
            font-size: 14px;
            line-height: 22px;
            text-align: left;
            padding: 10px 20px;
          }
          td.mail-link{
            text-align: center;
            padding: 20px 0;
          }
          a#reset-link {
            display: inline-block;
            padding: 20px 10px;
            background-color: #2da800;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            text-transform: uppercase;
            color: #fff;
            text-decoration: none;
            -moz-box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.2);
            -webkit-box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.2);
            box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.2);
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
          }
          a.link{
            color: #007bff;
            text-decoration: underline;
          }
          strong {
            font-weight: 700;
            color: #c61e42;
          }

          #mail-footer{
            background-color: #ffffff;
            border-top: 1px solid #ccc;
            
          }
          .logo-footer{
            display: inline-block;
            height: 60px;
            width: auto;
            padding: 20px 0;
          }
          .copyright{
            padding: 30px 0;
            background-color: #c61e42;
            text-align: center;
            color: #fff;
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div id="mail-wrapper">

        
          <table id="mail-header" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tbody>
              <tr>
                <td align="center"><a href="https://wakemeup.linto.ai" target="_blank"></a><img src="https://wakemeup.linto.ai/assets/img/wakemeup-logo.svg" class="logo"/></a></td>
              </tr>
            </tbody>
          </table>
          <!-- END Header -->
          <!-- Body -->
          <table id="mail-body" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tbody>
              <tr>
                <td class="mail-title">Réinitialisation de votre mot de passe</td>
              </tr>
              <tr>
                <td class="mail-content">
                  Bonjour <strong>${user},</strong>
                </td>
              </tr>
              <tr>
                <td class="mail-content">
                  Suite à votre demande de réinitialisation de mot de passe, nous vous invitons à cliquer sur le lien ci-dessous afin de mettre à jour ce dernier :
                </td>
              </tr>
              <tr>
                <td class="mail-link"><a href="${process.env.VUE_APP_URL}/${reinitLink}" id="reset-link">Réinitialiser mon mot de passe</a></td>
              </tr>
              <tr>
                <td class="mail-content">Si vous rencontrez des difficultés pour atteindre le lien de réinitialisation, veuillez copier le lien suivant, et le coller dans la barre de navigation de votre navigateur internet: ${process.env.VUE_APP_URL}/${reinitLink}</td>
              </tr>
              <tr>
                <td class="mail-content">Veuillez noter que ce lien sera actif pendant 30 minutes. Au delà de ce délai, vous devrez refaire une demande de mot de passe oublié pour obtenir un lien actif.</td>
              </tr>
              <tr>
                <td class="mail-content">Pour toute question, n'hésitez pas à contacter notre service technique à l'adresse suivante: <a class="link" href="#">mailto@[MAIL TECHNIIQUE]</a></td>
              </tr>
              <tr>
                  <td class="mail-content"><strong>L'équipe de Wakemeup</strong></td>
                </tr>
            </tbody>
          </table>
          <!-- END Body -->
          <table id="mail-footer" cellpadding="0" cellspacing="0" width="100%">
            <tbody>
                <tr>
                    <td align="center"><a href="https://wakemeup.linto.ai" target="_blank"><img src="https://wakemeup.linto.ai/assets/img/wakemeup-logo.svg" class="logo-footer"/></a></td>
                    <td align="center"><a href="https://research.linagora.com" target="_blank"><img src="https://wakemeup.linto.ai/assets/img/linagora-labs.png" class="logo-footer"/></a></td>
                </tr>
                <tr>
                  <td align="center" colspan="2" class="copyright">
                      © COPYRIGHT LINAGORA 2019
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>`

    return htmlTemplate
}

module.exports = {
  renderHtmlTemplate
}