<template>
  <div id="app">
     <div id="header">
      <HeaderApp></HeaderApp>
      <AppNotify></AppNotify>
    </div>
    <transition>
      <keep-alive>
        <router-view></router-view>
        
      </keep-alive>
    </transition>
    <FooterApp></FooterApp>
  </div>
</template>
<script>
import HeaderApp from '@/components/Header.vue'
import AppNotify from '@/components/AppNotify.vue'
import FooterApp from '@/components/Footer.vue'
export default {
  data() {
    return {};
  },
  components: {
    HeaderApp,
    AppNotify,
    FooterApp
  }
};
</script>