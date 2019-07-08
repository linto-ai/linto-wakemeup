<template>
  <div>
    <div class="modal" :class="[showPolicyModal ? 'visible' : 'hidden']">
      <div class="modal-container large">
        <div class="modal-header">
          <h3 class="modal-title red">Conditions générales d'utilisation</h3>
        </div>
        <div class="modal-body">
          <div class="content">
            <CGU></CGU>
          </div>
        </div>
        <div class="modal-footer">
          <button class="button red" @click="sendAgreement(false)">Refuser</button>
          <button class="button green" @click="sendAgreement(true)">Accepter</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CGU from './CGU.vue'
import { bus } from '../main.js'
export default {
  data () {
    return {
      showPolicyModal: false
    }
  },
  mounted () {
    bus.$on('show_policy_agreement', () => {
      this.showPolicyModal = true
    })
  },
  methods: {
    sendAgreement (data) {
      bus.$emit('policy_agreement_response', data)
      this.showPolicyModal = false
    }
  },
  components: {
    CGU
  }
}
</script>
