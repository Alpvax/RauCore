import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import { auth as fbAuth } from "firebase";

import VueCompositionApi from "@vue/composition-api";
import vueHooks from "@u3u/vue-hooks";

Vue.use(vueHooks);

Vue.config.productionTip = false;

fbAuth().onAuthStateChanged(function(fbuser) {
  if (fbuser) {
    // User is signed in.
    store.dispatch("setUserID", fbuser.uid);
  } else {
    // User is signed out.
    store.dispatch("setUserID", null);
  }
});

Vue.use(vueHooks);
Vue.use(VueCompositionApi);

store.dispatch("setRunesRef", "runes");
store.dispatch("setMessagesRef", "messaging");

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount("#app");
