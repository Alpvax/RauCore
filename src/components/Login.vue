<template>
  <section id="firebaseui-auth-container">
  </section>
</template>

<script lang="ts">
import { createComponent, onMounted } from "@vue/composition-api";
import { useRouter } from "@/helpers";
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

export default createComponent({
  setup(props, context) {
    const { route, router } = useRouter();
    let authUI = firebaseui.auth.AuthUI.getInstance();
    onMounted(() => {
      let signInSuccessUrl: string = route.value.query.redirectUrl as string | null || "/";
      if (!authUI) {
        authUI = new firebaseui.auth.AuthUI(auth());
        uiConfig.callbacks = {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            console.log("Redirection to:", redirectUrl, "\nQuery:", signInSuccessUrl);//XXX
            router.push(signInSuccessUrl);
            return false;
          },
        };
      }
      authUI.start("#firebaseui-auth-container", Object.assign({ signInSuccessUrl }, uiConfig));
    });
    return {};
  },
  /*mounted() {
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
  },*/
});
</script>
