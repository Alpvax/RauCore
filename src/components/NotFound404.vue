<template>
  <div class="not-found">
    <div class="error-code">{{errorCode}}</div>
    Page not found.
  </div>
</template>

<script lang="ts">
import { createComponent } from "@vue/composition-api";
import { useGetters, runesToString } from "@/helpers";

export default createComponent({
  setup(props, context) {
    const { getRuneByName } = useGetters("getRuneByName");
    const neveRune = getRuneByName.value("neve");
    const atzRune = getRuneByName.value("atz");

    let errorCode = "404";

    if (neveRune && atzRune) {
      errorCode = runesToString([neveRune, atzRune, neveRune]);
    }

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
