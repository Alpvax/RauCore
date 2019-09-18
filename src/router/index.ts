import { useGetters } from "@u3u/vue-hooks";
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import * as components from "@/components";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/runes",
    name: "runes",
    component: components.RunesPage,
  },
  {
    path: "/chat",
    component: components.ChatPage,
    children: [
      {
        path: ":id",
        name: "chat",
        component: components.MessageList,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: components.Login,
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
    if (!useGetters(["loggedIn"]).loggedIn.value) {
      next({
        name: "login",
        query: { redirectUrl: to.fullPath },
      });
      return; //Break early
    }
  }
  next(); // make sure to always call next()!
});

export default router;
