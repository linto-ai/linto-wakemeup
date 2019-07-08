<template>
  <div>
    <h2 class="green">Données enregistrées</h2>
    <p>En créant un compte sur wakemeup.linto.ai, nous vous demandons de renseigner un certain nombre de données personnelles, telles que: votre adresse email, votre sexe, votre tranche d'âge, votre langue maternelle et votre type de microphone.</p>
    <p>Ces données nous serviront à apporter des précisions techniques lors de l'étude des échantillons audio ou la création de corpus de mots-clés.</p>
    <p>Nous nous engageons à récolter ces données de manières totalement anonymes, c'est-à-dire:</p>
    <ul>
      <li>Votre adresse email ne sera jamais rattachée à un échantillon audio dans notre modèle de données</li>
      <li>Votre adresse email servira uniquement à vous transmettre un nouveau mot de passe en cas de perte de ce dernier</li>
      <li>À la création de votre compte, une clé unique d'identification sera créée et rattachée aux fichiers audio que vous aurez enregistré. Cette clé ne vous identifie pas personnellement. Dans le cas où vous souhaitez supprimer vos données personnelles de notre site web, elle nous permettra de supprimer les fichiers audio que vous aurez enregistré</li>
      <li>Les données personnelles comme votre tranche d'âge, votre sexe ou votre langue native nous serviront pour créer des corpora de mots-clés et nous permettront d'avoir des données techniques qui ne vous identifient pas personnellement</li>
    </ul>

    <h2 class="green">Traitement des données audio</h2>
    <p>Wakemeup.linto.ai a pour but d'enregistrer votre voix sur des échantillons audios de 3,5 secondes maximum concernant des mots courants dans le pilotage vocal d'assistants intelligents. Ces mots sont aussi appelés "mots-réveil" (wake up words) et sont utilisés pour interpeller un assistant vocal. Dans le cadre du projet LinTO, le recueil des ces données nous permet par exemple d'augmenter la qualité et la rapidité de reconnaissance du mot-réveil de base ("LinTO")</p>
    <p>Les échantillons audio créés par les utilisateurs de la plateforme Wakemeup.linto.ai seront utilisés pour créer des corpora de mots-clés qui seront distribués et mis à jour régulièrement sur cette même plateforme. Les corpora constitués seront ensuite utilisés pour entraîner des modèles (machine learning) de reconnaissance de la parole compatibles avec les outils d'inférence déployés sur l'assistant LinTO. Ces mêmes modèles seront également distribués dans les ressources techniques liées au projet.</p>
    <p>Lors de l'enregistrement audio, nous récolterons les données suivantes:</p>
    <ul>
      <li>Mot-clé enregistré</li>
      <li>Sexe du locuteur</li>
      <li>Tranche d'âge du locuteur</li>
      <li>Nationalité du locuteur</li>
      <li>Type de microphone utilisé par le locuteur</li>
      <li>Données techniques du navigateur (fréquence d'échantillonage, option de suppression du bruit, option d'annulation de l'écho, taille du fichier audio généré, etc.)</li>
      <li>Date d'enregistrement</li>
      <li>Clé d'identification unique du locuteur (ne donne pas d'indication sur les données personnelles de l'utilisateur)</li>
    </ul>
    <p>Les échantillons enregistrés ne seront pas directement ajoutés à un corpus, il faudra d'abord qu'ils soient écoutés et validés par au moins 5 utilisateurs avant d'être incorporés.</p>

    <h2 class="green">Suppression d'un compte utilisateur</h2>
    <p>Vous aurez la possibilité de supprimer votre compte utilisateur à tout moment. Si vous effectuez cette action, vos données personnelles seront supprimées des bases de données de wakemeup.linto.ai.</p>
    <p>Pour cela :</p>
    <ul>
      <li>Connectez vous à votre compte</li>
      <li>Ouvrez le menu en haut à droite de l'écran et cliquez sur "Mon compte"</li>
      <li>Une fois sur la page "Mon compte", cliquez sur "Supprimer mon compte</li>
      <li>Validez votre choix</li>
    </ul>
    <p>Les échantillons audio que vous aurez produits seront également supprimés de nos serveurs et ne serviront pas à alimenter les "futurs" corpora de données audio.</p>
    <p>Du fait que les enregistrements sont faits de manière anonyme, nous ne pourrons cependant pas les supprimer des modèles de données existants.</p>

    <h2 class="green">Gestion des cookies</h2>
    <p>Des cookies sont utilisés dans le seul but d'améliorer votre expérience utilisateur. Aucune donnée personnelle ou sensible n'est stockée lors de votre navigation.</p>
    <p>Les cookies mis en place servent uniquement à gérer votre "session de connexion" et à valider le fait que vous ayez pris connaissance de l'utilisation des cookies sur l'interface.</p>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>

