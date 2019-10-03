<template>
  <div class="not-found">
    <div class="error-code">{{errorCode}}</div>
    Page not found.
  </div>
</template>

<script lang="ts">
import { createComponent, computed } from "@vue/composition-api";
import { useGetters, runesToString } from "@/helpers";

export default createComponent({
  setup(props, context) {
    const { byName: getRuneByName } = useGetters("runesmodule",["byName"]);

    const errorCode = computed(() => {
      const neveRune = getRuneByName.value("neve");
      const atzRune = getRuneByName.value("atz");
      if (neveRune && atzRune) {
        return runesToString([neveRune, atzRune, neveRune]);
      } else {
        return "404";
      }
    });

    return {
      errorCode,
    };
  },
});
</script>

<style scoped>
.error-code {
  font-size: 5.5em;
  margin: 20px;
}
</style>
