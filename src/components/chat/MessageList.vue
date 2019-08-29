<template>
  <div>
    <message v-for="msg in messages" :key="msg.id" :message="msg"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Message from "./Message.vue";
import { ChatMessage } from "@/types/Messages";
import { DBMessage } from "@/types/firebase/rtdb";

export default Vue.extend({
  name: "MessageList",
  data() {
    return {
      chatID: "",
    }
  },
  computed: {
    /*chatID(): string {
      return this.$route.params.id;
    },*/
    messages(): ChatMessage[] {
      console.log("Retrieving messages for chat:", this.chatID);//XXX
      if (this.chatID) {
        let chatObj: { [k: string]: DBMessage } = this.$store.getters.messages[this.chatID];
        console.log(chatObj);//XXX
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
            }
          });
        }
      }
      return [];
    },
  },
  methods: {
    setChat(chat: string): void {
      this.chatID = chat;
      this.$store.dispatch("setChat", chat);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
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
