import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import { vuexfireMutations, firebaseAction, firestoreAction } from "vuexfire";
import { Rune, User } from "./types";
import { DBMessage } from "./types/firebase/rtdb";

const firebaseConfig = {
  apiKey: "AIzaSyBBpBbncl_mEM2NwZIBKL3Fe11CPOULT58",
  authDomain: "rau.firebaseapp.com",
  databaseURL: "https://rau.firebaseio.com",
  projectId: "firebase-rau",
  storageBucket: "firebase-rau.appspot.com",
  messagingSenderId: "248482438873",
  appId: "1:248482438873:web:1f9f4ea54343c8d7",
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const fs = firebase.firestore();
const auth = firebase.auth();
auth.useDeviceLanguage();

Vue.use(Vuex);

interface RauState {
  runes: Rune[];
  messages: { [k: string]: DBMessage };
  settings: {};
  user: User | null;
  currentChat: string;
}

export default new Vuex.Store<RauState>({
  state: {
    runes: [],
    messages: {},
    settings: {},
    user: null,
    currentChat: "broadcast",
  },
  mutations: {
    SET_CHAT(state, chat) {
      state.currentChat = chat;
    },
    ...vuexfireMutations,
  },
  getters: {
    runes(state): Rune[] {
      return state.runes;
    },
    messages(state): { [k: string]: DBMessage } {
      return state.messages;
    },
    db(state) {
      return db;
    },
    currentChat(state) {
      return state.currentChat;
    },
  },
  actions: {
    setRunesRef: firestoreAction(async ({ bindFirestoreRef }, ref) =>
      bindFirestoreRef("runes", fs.collection(ref).orderBy("codepoint"))
    ),
    setMessagesRef: firebaseAction(async ({ bindFirebaseRef }, ref) =>
      bindFirebaseRef("messages", db.ref(ref))
    ),
    setChat({ commit }, chat) {
      commit("SET_CHAT", chat);
    },
    /*addMessage() {
      //TODO:
    },*/
    async login(context, provider) {
      let user = await auth.signInWithPopup(provider);
      console.log(user.user);
    },
  },
});
