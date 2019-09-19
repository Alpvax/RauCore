<template>
  <div class="message" :class="[sendrecieve]" :style="nameColour">
    <span class="messageComponentName">{{message.sender.name}}</span>
    <span class="messageComponentDate">{{time}}</span>
    <span class="messageComponentBody">{{message.text}}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ChatMessage } from "@/types";
export default Vue.extend({
  name: "Message",
  props: {
    message: {
      type: Object as () => ChatMessage,
    },
  },
  computed: {
    nameColour(): Partial<CSSStyleDeclaration> {
      let c: [number, number, number] | undefined = this.message.sender.colour;
      if (c) {
        return {
          color: "rgb(" + c.map(n => Math.min(0, Math.max(255, n))).join(", ") + ")",
        };
      }
      return {};
    },
    sendrecieve(): string {
      return this.$store.getters.loggedIn && this.$store.getters.user.id == this.message.sender.id
        ? "sent"
        : "recieved";
    },
    time(): string {
      return new Date(this.message.time).toLocaleString("en-GB");
    },
  },
});
</script>

<style scoped>
.message {
    padding: 0px 5px;
    margin: 10px 2px;
    border-radius: 10px;
    box-shadow: 0.5px 1px 1px 1px #aaaaaa;
    background: #ffffff;
}
.message.sent {
    border-bottom-right-radius: 2px;
    margin-left: 20%;
}
.message.recieved {
    border-top-left-radius: 2px;
    margin-right: 20%;
}
.messageComponentDate {
    font-size: 0.74em;
    color: #999999;
    padding-right: 7px;
    padding-top: 5px;
    line-height: 0.8;
    float: right;
    text-align: right;
}
.messageComponentName {
    padding: 0px 5px;
    font-weight: bold;
    float: left;
}
.messageComponentBody {
    padding: 0px 5px;
    display: block;
    clear: both;
}
</style>
