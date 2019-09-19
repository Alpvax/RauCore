<template>
  <div class="messagelist">
    <message v-for="msg in messages" :key="msg.id" :message="msg"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Message from "./Message.vue";
import { ChatMessage } from "@/types";
import { DBMessage } from "@/types/firebase/rtdb";

export default Vue.extend({
  name: "MessageList",
  data() {
    return {
      chatID: "",
    };
  },
  computed: {
    messages(): ChatMessage[] {
      if (this.chatID) {
        let chatObj: { [k: string]: DBMessage } = this.$store.getters.messages[this.chatID];
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
    },
  },
  watch: {
    messages(newVal, oldVal) {
      //let lastID = newVal[newVal.length - 1].id;
      this.$nextTick(this.scrollToEnd);
    },
  },
  methods: {
    setChat(chat: string): void {
      this.chatID = chat;
      this.$store.dispatch("setChat", chat);
    },
    scrollToEnd: function () {
      // scroll to the start of the last message
      let lastChild = this.$el.lastElementChild;
      if (lastChild) {
        this.$el.scrollTop = lastChild.getBoundingClientRect().top;
      }
      console.log("Scrolling");//XXX
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //@ts-ignore
      vm.setChat(to.params.id);
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.setChat(to.params.id);
    next();
  },
  components: {
    Message,
  },
});
</script>

<style>
.messagelist {
  flex: 1 1 0;
  overflow-y: auto;
}
</style>
