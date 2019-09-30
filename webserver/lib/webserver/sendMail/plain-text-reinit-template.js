function renderPlainTextTemplate (user, reinitLink) {
  const plainTextTemplate = `
==================
Wake me up
==================

Réinitialisation de votre mot de passe


Bonjour ${user}
Suite à votre demande de réinitialisation de mot de passe, nous vous invitons à suivre le lien suivant afin de mettre à jour ce dernier :
-----------------

${process.env.VUE_APP_URL}/${reinitLink}

-----------------

Veuillez noter que ce lien sera actif pendant 30 minutes. Au delà de ce délai, vous devrez refaire une demande de mot de passe oublié pour obtenir un lien actif.

Pour toute question, n'hésitez pas à contacter notre service technique à l'adresse suivante: [MAIL TECHNIIQUE]

==================

COPYRIGHT LINAGORA 2019
Siège social: LINAGORA SAS, Tour Franklin, 100 Terrasse Boieldieu, 92800 Puteaux, France
Téléphone: +33 810 251 251`

    return plainTextTemplate
}

module.exports = {
  renderPlainTextTemplate
}