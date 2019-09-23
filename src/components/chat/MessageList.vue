<template>
  <div ref="listel" class="messagelist">
    <message v-for="msg in messages" :key="msg.id" :message="msg"/>
  </div>
</template>

<script lang="ts">
import { createComponent, computed, ref, watch } from "@vue/composition-api";
import { useGetters, useActions } from "@/helpers";
import Message from "./Message.vue";
import { DBMessage } from "@/types/firebase/rtdb";

export default createComponent({
  components: {
    Message,
  },
  setup(props, context) {
    const getters = useGetters("messages", "currentChat");
    const chatID = getters.currentChat;
    const listel = ref<Element | null>(null);
    const messages = computed(() => {
      if (chatID.value) {
        let chatObj: { [k: string]: DBMessage } = getters.messages.value[chatID.value];
        if (chatObj) {
          return Object.entries(chatObj).map(([id, msg]) => {
            return {
              id,
              sender: {
                id: msg.user,
                name: msg.user, //TODO: get name from DB
              },
              time: msg.time,
              read: new Set(Object.keys(msg.read).filter(n => n)),
              text: msg.text,
            };
          });
        }
      }
      return [];
    });
    function scrollToEnd() {
      // scroll to the start of the last message
      let el = listel.value!;
      let lastChild = el.lastElementChild;
      if (lastChild) {
        el.scrollTop = lastChild.getBoundingClientRect().top;
      }
      console.log("Scrolling");//XXX
    }
    watch(messages, (newVal, oldVal) => {
      context.root.$nextTick(scrollToEnd);
    });
    return {
      chatID,
      listel,
      messages,
      scrollToEnd,
    };
  },
  //@ts-ignore
  beforeRouteUpdate(to, from, next) {
    const { setChat } = useActions("setChat");
    setChat(to.params.id);
    next();
  },
});
</script>

<style>
.messagelist {
  flex: 1 1 0;
  overflow-y: auto;
}
</style>
