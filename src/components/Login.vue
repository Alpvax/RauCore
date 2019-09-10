<template>
  <section id="firebaseui-auth-container">
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { auth } from "firebase";
import * as firebaseui from "firebaseui";

const uiConfig: firebaseui.auth.Config = {
  callbacks: {
  },
  //queryParameterForSignInSuccessUrl: "redirectUrl",
  signInOptions: [
    auth.GoogleAuthProvider.PROVIDER_ID,
    auth.GithubAuthProvider.PROVIDER_ID,
    auth.FacebookAuthProvider.PROVIDER_ID,
  ],
};

export default Vue.extend({
  name: "login",
  mounted() {
    let authUI = firebaseui.auth.AuthUI.getInstance();
    let signInSuccessUrl: string = this.$route.query.redirectUrl as string | null || "/";
    if (!authUI) {
      authUI = new firebaseui.auth.AuthUI(auth());
      uiConfig.callbacks = {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          console.log("Redirection to:", redirectUrl, "\nQuery:", signInSuccessUrl);
          this.$router.push(signInSuccessUrl);
          return false;
        },
      };
    }
    authUI.start("#firebaseui-auth-container", Object.assign({ signInSuccessUrl }, uiConfig));
  },
  beforeRouteEnter(to, from, next) {
    let redirect: string | false = to.query.redirectUrl as string || false;
    console.log(from, auth().currentUser, redirect);//XXX
    if (auth().currentUser) {
      next(redirect);
    } else if (redirect) {
      next();
    } else {
      next({ name: "login", query: { redirectUrl: from.fullPath }});
    }
  },
});
</script>
