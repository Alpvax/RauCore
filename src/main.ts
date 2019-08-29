import Vue from "vue"
import App from "./App.vue"
import store from "./store"

Vue.config.productionTip = false

import { RunesPage, ChatPage, MessageList } from "./components";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/login",
    component: RunesPage},
  {
    path: "/runes",
    component: RunesPage
  },
  {
    path: "/chat",
    component: ChatPage,
    /*beforeEnter: (to, from, next) => {
      next((vm) => {
        return false;//TODO: Check authentication
      });
    },*/
    //redirect: "/chat/",
    children: [
      { path: ":id", component: MessageList },
      { path: "", redirect: "broadcast" },
    ],
  },
  { path: "", redirect: '/runes' }, //Fallback to /runes
]

const router = new VueRouter({
  routes,
});

store.dispatch("setRunesRef", "runes");
store.dispatch("setMessagesRef", "messages");

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app")
