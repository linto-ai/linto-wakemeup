<template>
  <div id="notifyApp" :style="notifHeight" >
    <div id="notif-container" :class="status">
      <span  class="notif-line"></span>
      <span class="icon"></span>
      <span class="label">{{msg}}</span>
    </div>
  </div>
</template>
<script>
import { bus } from '../main'
export default {
  data () {
    return {
      msg:'',
      status: '',
      redirect: '',
      notifHeight: 'height: 0px;',
      redirectMsg: ''
    }
  },
  async mounted () {
    bus.$on('notify_app', (data) => {
      this.msg = data.msg
      this.status = data.status
      this.redirect = data.redirect
      if (this.redirect) {
        this.redirectMsg = 'Vous allez être redirigé...'
      }

      setTimeout(() => {
        const notifHeight = document.getElementById('notif-container').offsetHeight;
        this.notifHeight = 'height: '+ (notifHeight + 45) + 'px'
      }, 200)
      setTimeout(() => {
        this.notifHeight = 'height: 0px;'
        if (this.redirect) {
          document.location.href= this.redirect
        }
      }, 1500)
    })
  }
}
</script>
