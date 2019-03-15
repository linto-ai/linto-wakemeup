<template>
  <div class="header-container container-fluid">
    <div class="row">
      <div class="col logo-container">
        <img id="wakemeup-logo" src="/assets/img/wakemeup-logo.svg" alt="Wake Me Up" />
        <img id="linagora-labs-logo" src="/assets/img/linagora-labs.png" alt="Linagora Labs" />
      </div>
      <div class="col user-panel">
        <button class="button red" @click="toggleConnectionModal()">Se connecter</button>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  data () {
    return {}
  },
  methods : {
    toggleConnectionModal () {
      console.log('EMIT ? ')
      bus.$emit('toggle_connection_modal', {})
    }
  }
  
}
</script>

