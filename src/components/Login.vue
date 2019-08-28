<template>
  <form>
    <h1>You need to be Logged in to access some of the site</h1>
    <a class="btn loginBtn" data-login-provider="google">Google</a>
    <a class="btn loginBtn" data-login-provider="facebook">Facebook</a>
    <a class="btn loginBtn" data-login-provider="github">Github</a>
    <a class="btn loginBtn" data-login-provider="twitter">Twitter</a>
  </form>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "login",
});
</script>
