<template>
  <div>
    <div id="page-content">
      <div id="home">
        <div id="highlight" class="container-fluid">
          <div class="row">
            <div class="col talk">
              <h2>Enregistrez votre voix</h2>
              <div class="title-icon">
                <img src="/assets/img/talk.svg" alt="Parler">
              </div>
              <div
                class="highlight-content"
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod malesuada nisl, sit amet vulputate justo interdum nec. Donec lobortis, ipsum vitae hendrerit sodales, purus risus fringilla ante, eu auctor mi velit ut turpis.</div>
              <div class="highlight-action">
                <a href="/interface/record" class="button red">Enregistrez votre voix</a>
              </div>
            </div>
            <div class="col listen">
              <h2>Écoutez et participez à la validation</h2>
              <div class="title-icon">
                <img src="/assets/img/listen.svg" alt="Ecouter">
              </div>
              <div
                class="highlight-content"
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod malesuada nisl, sit amet vulputate justo interdum nec. Donec lobortis, ipsum vitae hendrerit sodales, purus risus fringilla ante, eu auctor mi velit ut turpis.</div>
              <div class="highlight-action">
                <a href="/interface/listen" class="button green">Écouter des enregistrements</a>
              </div>
            </div>
          </div>
        </div>
        <div class="divider red shadowTop"></div>
      </div>
    </div>
    <ConnectionModal></ConnectionModal>
    <CreateAccountModal></CreateAccountModal>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import ConnectionModal from '@/components/ConnectionModal.vue'
import CreateAccountModal from '@/components/CreateAccountModal.vue'
import { bus } from '../main.js'
export default {
  data () {
    return {
      showConnectModal: false
    }
  },
  components: {
    Header,
    ConnectionModal,
    CreateAccountModal
  }
}
</script>