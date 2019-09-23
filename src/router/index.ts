import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import * as components from "@/components";
import { auth } from "firebase";

Vue.use(VueRouter);

function isLoggedIn() {
  return !!auth().currentUser;
}
auth().onAuthStateChanged(function(fbuser) {
  if (fbuser && router.currentRoute.name === "login") {
    router.push("/");
  } else if (!fbuser && router.currentRoute.matched.some(r => r.meta.requiresAuth)) {
    router.push("/login");
  }
});

const routes: RouteConfig[] = [
  {
    path: "/runes",
    name: "runes",
    component: components.RunesPage,
  },
  {
    path: "/chat",
    component: components.ChatPage,
    /*beforeEnter(to, from, next) {
      if (isLoggedIn()) {
        next(redirect);
      } else if (redirect) {
        next();
      } else {
        next({ name: "login", query: { redirectUrl: from.fullPath }});
      }
    },*/
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
    beforeEnter(to, from, next) {
      let redirect: string | false = to.query.redirectUrl as string || false;
      if (isLoggedIn()) {
        next(redirect);
      } else if (redirect) {
        next();
      } else {
        next({ name: "login", query: { redirectUrl: from.fullPath }});
      }
    },
  },
  { path: "", redirect: "/runes" }, //Default to /runes
  { path: "*", component: components.NotFound404 }, //Fallback to 404
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn()) {
    next({
      name: "login",
      query: { redirectUrl: to.fullPath },
    });
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
