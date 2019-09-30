<template>
  <div class="h-100">
    <div id="page-content">
      <h1 class="red">Nous contacter</h1>
      <div class="row justify-content-center">
        <div class="col-xl-4 col-md-5">
          <div class="white-container contact-form-container">
            <h2 class="green">Écrivez-nous</h2>
            <ContactForm></ContactForm>
          </div>
        </div>
        <div class="col-xl-4 col-md-5 coordonnees">
          <div class="white-container contact-form-container">
            <h2 class="green">Coordonnées</h2>
            <div>
              <h3 class="red">LINAGORA FRANCE – Paris La Défense</h3>
              <div class="contat-item row">
                <div class="col-2">
                  <span class="icon address"></span>
                </div>
                <div class="col-10">
                  <span class="label">100 Terrasse Boieldieu – Tour Franklin</span>
                  <span class="label">92042 Paris – La Défense CEDEX</span>
                </div>
              </div>
              <div class="contat-item row">
                <div class="col-2">
                  <span class="icon phone"></span>
                </div>
                <div class="col-10">
                  <span class="label"><a href="tel:+33146966363" target="_blank">+33 1 46 96 63 63</a></span>
                </div>
              </div>
              <div class="contat-item row">
                <div class="col-2">
                  <span class="icon email"></span>
                </div>
                <div class="col-10">
                  <span class="label"><a href="mailto:info@linagora.com" target="_blank">info@linagora.com</a></span>
                </div>
              </div>
            </div>
            <div class="contat-item row">
              <h3 class="red">Visitez nos sites web</h3>
              <div class="col-6 contact-link">
                <a href="https://linagora.com" target="_blank" >
                  <img src="/assets/img/linagora.png" class="contact-link-img">
                  <span class="link-label">linagora.com</span>
                </a>
              </div>
              <div class="col-6 contact-link">
                <a href="https://research.linagora.com/display/home/Home">
                  <img src="/assets/img/linagora-labs.png" class="contact-link-img">
                  <span class="link-label">research.linagora.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ContactForm from '@/components/ContactForm.vue'
export default {
  data () {
    return {}
  },
  components: {
    ContactForm
  }
}
</script>


