<template>
  <div id="app" class="flex col">
        <transition>
          <keep-alive>
            <router-view class="flex1 flex row" id="app-wrapper"></router-view>
          </keep-alive>
        </transition>
        <ModalMentionsLegales class="modal-wrapper flex row" :class="showLegals ? 'visible': 'hidden'"></ModalMentionsLegales>
        <div class="flex row" id="footer">
          Copyright Linagora 2019 - <button @click="showLegalsModal()" class="footer-btn">Mentions légales</button>
        </div>
      </div>
</template>
<script>
import axios from 'axios'
import ModalMentionsLegales from '@/components/ModalMentionsLegales.vue'
import { bus } from './main-onepage.js'
export default {
  data () {
    return {
      showLegals: false
    }
  },
  mounted () {
    bus.$on('close_modal_legals', () => {
      this.showLegals = false
    })
  },
  methods: {
    showLegalsModal () {
      this.showLegals = true
    }
  },
  
  components: {
    ModalMentionsLegales
  }
}
</script>
