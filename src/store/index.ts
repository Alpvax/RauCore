import Vue from "vue";
import Vuex from "vuex";
import { getStoreBuilder, StoreBuilder } from "vuex-typex";
import firebase from "firebase";
//import { vuexfireMutations, firebaseAction, firestoreAction } from "vuexfire";
import { Rune, User } from "@/types";
import { DBMessage } from "@/types/firebase/rtdb";
import * as actions from "./actions";

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

/*const db = firebase.database();
const fs = firebase.firestore();*/
const auth = firebase.auth();
auth.useDeviceLanguage();

Vue.use(Vuex);

type PickAction<A extends keyof typeof actions> = (typeof actions)[A];
type ExtractPayload<T> = T extends () => any ? never : T extends (p: infer P) => any ? P : never;
export function dispatch<K extends keyof typeof actions, A = PickAction<K>, P = ExtractPayload<A>>(
  action: K,
  ...payload: A extends () => any ? never[] : A extends (p: infer P) => any ? [P] : never[]
): ReturnType<(typeof actions)[K]> {
  //@ts-ignore
  return actions[action](payload);
}

export interface RauState {
  runes: Rune[];
  messages: { [k: string]: DBMessage };
  settings: {};
  user: User | null;
  currentChat: string;
}

export type InitFunc = (builder?: StoreBuilder<RauState>) => void;

const builder = getStoreBuilder<RauState>();

async function initStoreModules() {
  ["auth", "runes"].forEach(async (m) => {
    let initFunc: InitFunc = await import("./modules/" + m);
    initFunc(builder);
  });
}
initStoreModules();

export default builder.vuexStore(/*new Vuex.Store<RauState>(*/{
  state: {
    runes: [],
    messages: {},
    settings: {},
    user: null,
    currentChat: "broadcast",
  },
});/*
  mutations: {
    /*SET_USER(state, user: User | null) {
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
    /*loggedIn(state) {
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
    /*async setUser({ commit }, user: User | null) {
      commit("SET_USER", user);

    },
    async logOut() {
      await auth.signOut();
    },
    /*addMessage() {
      //TODO:
    },
  },
});*/
