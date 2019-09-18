import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import { auth as fbAuth } from "firebase";
import { User } from "./types";

import VueCompositionApi from "@vue/composition-api";
import vueHooks from "@u3u/vue-hooks";

Vue.use(vueHooks);

Vue.config.productionTip = false;

fbAuth().onAuthStateChanged(function(fbuser) {
  console.log("AUTH:", fbuser);//XXX
  if (fbuser) {
    // User is signed in.
    let user: User = {
      id: fbuser.uid,
      name: fbuser.displayName || fbuser.uid,
    };
    store.dispatch("setUser", user);
  } else {
    // User is signed out.
    store.dispatch("setUser", null);
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
