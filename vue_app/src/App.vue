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
  </div>
</template>
<script>
import HeaderApp from '@/components/Header.vue'
import AppNotify from '@/components/AppNotify.vue'
export default {
  data() {
    return {};
  },
  components: {
    HeaderApp,
    AppNotify
  }
};
</script>