import Vue from "vue";
import App from "./App.vue";
import store from "./store";

Vue.config.productionTip = false;

import { Login, RunesPage, ChatPage, MessageList } from "./components";
import VueRouter, { RouteConfig } from "vue-router";
/*import { auth as fbAuth } from "firebase";
import { User } from "./types";

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
});*/

console.log("STORE:", store);//XXX

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/runes",
    name: "runes",
    component: RunesPage,
  },
  {
    path: "/chat",
    component: ChatPage,
    children: [
      {
        path: ":id",
        name: "chat",
        component: MessageList,
        meta: { requiresAuth: true },
      },
    ],
  },
  { path: "", redirect: "/runes" }, //Default to /runes
  //TODO: 404;{ path: "*", component: NotFound404 }, //Fallback to 404
];

const router = new VueRouter({
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.loggedIn) {
      next({
        name: "login",
        query: { redirectUrl: to.fullPath },
      });
      return; //Break early
    }
  }
  next(); // make sure to always call next()!
});

store.dispatch("setRunesRef", "runes");
store.dispatch("setMessagesRef", "messaging");

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount("#app");
