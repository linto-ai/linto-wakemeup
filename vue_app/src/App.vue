<template>
  <div id="app">
     <div id="header">
      <HeaderApp></HeaderApp>
    </div>
    <div id="test">
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>
<script>
import HeaderApp from '@/components/Header.vue'
export default {
  data() {
    return {};
  },
  components: {
    HeaderApp
  }
};
</script>