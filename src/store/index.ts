import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import { vuexfireMutations, firebaseAction, firestoreAction } from "vuexfire";
import { Rune, User } from "@/types";
import { DBMessage } from "@/types/firebase/rtdb";

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

export interface RauState {
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
    SET_USER(state, user: User | null) {
      state.user = user;
    },
    SET_CHAT(state, chat: string) {
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
    loggedIn(state) {
      return state.user !== null;
    },
    user(state): User | null {
      return state.user;
    },
  },
  actions: {
    setRunesRef: firestoreAction(async ({ bindFirestoreRef }, ref: string) =>
      bindFirestoreRef("runes", fs.collection(ref).orderBy("codepoint"))
    ),
    setMessagesRef: firebaseAction(async ({ bindFirebaseRef }, ref: string) =>
      bindFirebaseRef("messages", db.ref(ref))
    ),
    async setChat({ commit }, chat: string) {
      commit("SET_CHAT", chat);

    },
    async setUser({ commit }, user: User | null) {
      commit("SET_USER", user);

    },
    async logOut() {
      await auth.signOut();
    },
    /*addMessage() {
      //TODO:
    },*/
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as vuex_type_shim from "@/types/vuex";
export type actiontypes = {
  setRunesRef: (ref: string) => Promise<firebase.firestore.DocumentData[]>;
  setMessagesRef: (ref: string) => Promise<firebase.database.DataSnapshot>;
  setChat: (chat: string) => Promise<void>;
  setUser: (user: User | null) => Promise<void>;
  logOut: () => Promise<void>;
};

export type gettertypes = {
  runes: Rune[];
  messages: { [k: string]: DBMessage };
  db: firebase.database.Database;
  currentChat: string;
  loggedIn: boolean;
  user: User | null;
};
