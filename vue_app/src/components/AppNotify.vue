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
      notifHeight: 'height: 0px;'
    }
  },
  async mounted () {
    bus.$on('notify_app', (data) => {
      this.msg = data.msg
      this.status = data.status
      this.redirect = data.redirect
      if (this.redirect) {
        this.msg += ' Vous serez redirigé dans 3sec...'
      }
      setTimeout(() => {
        const notifHeight = document.getElementById('notif-container').offsetHeight;
        this.notifHeight = 'height: '+ (notifHeight + 10) + 'px'
      }, 200)

      setTimeout(() => {
        this.notifHeight = 'height: 0px;'
        if(this.redirect){
          document.location.href= this.redirect
        }
      }, 3000)
    })
  }
}
</script>
