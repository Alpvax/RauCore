<template>
  <div>Showing messages for: {{$route.params.id}}</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "MsgPage",
  computed: {
  },
  mounted() {
    this.$store.dispatch("setMessagesRef", "messaging");
  }
});
</script>

<style>
table {
  display: block;
  width: 100%;
  overflow: auto;
  word-break: normal;
  word-break: keep-all;
  }
table th {
  font-weight: bold;
}
table th, table td {
  padding: 0.5rem 1rem;
  border: 1px solid #e9ebec;
}
</style>
