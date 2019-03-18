import Vue from "vue";
import Interface from "./Interface.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
export const bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(Interface)
}).$mount("#app");
