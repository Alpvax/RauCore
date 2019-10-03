<template>
  <div class="message" :class="[sendrecieve]" :style="nameColour">
    <span class="messageComponentName">{{message.sender.name}}</span>
    <span class="messageComponentDate">{{time}}</span>
    <span class="messageComponentBody">{{message.text}}</span>
  </div>
</template>

<script lang="ts">
import { createComponent, computed } from "@vue/composition-api";
import { ChatMessage } from "@/types";
import { useGetters } from "@/helpers";

export default createComponent({
  props: {
    message: {
      type: Object as () => ChatMessage,
      required: true,
    },
  },
  setup(props, context) {
    const nameColour = computed(() => {
      let c: [number, number, number] | undefined = props.message.sender.colour;
      if (c) {
        return {
          color: "rgb(" + c.map(n => Math.min(255, Math.max(0, n))).join(", ") + ")",
        };
      }
      return {};
    });
    const { user } = useGetters(["user"]);
    const sendrecieve = computed(() => {
      return user.value && user.value.id === props.message.sender.id
        ? "sent"
        : "recieved";
    });
    const time = computed(() => new Date(props.message.time).toLocaleString("en-GB"));
    return {
      nameColour,
      sendrecieve,
      time,
    };
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
