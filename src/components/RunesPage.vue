<template>
  <table id="runeTable">
    <tr>
      <th>Rune</th>
      <th>Name</th>
      <th>Unicode code point</th>
      <th>Latin input character</th>
      <th>Category</th>
    </tr>
    <tr v-for="rune in runes" :key="rune.name">
      <td>{{String.fromCharCode(rune.codepoint)}}</td>
      <td>{{rune.name}}</td>
      <td>{{rune.codepoint.toString(16).toUpperCase()}}</td>
      <td>{{rune.latinInput}}</td>
      <td>{{rune.category}}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import { createComponent } from "@vue/composition-api";
import { useGetters } from "@/helpers";

export default createComponent({
  setup(props, context) {
    const { runes } = useGetters("runes");
    return { runes };
  },
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
