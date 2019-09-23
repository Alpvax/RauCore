<template>
  <div class="chatpage">
    <h5>Showing messages for: {{$route.params.id}}</h5>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { createComponent } from "@vue/composition-api";
export default createComponent({
  //name: "ChatPage",
});
</script>

<style>
.chatpage {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
