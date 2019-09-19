import Vue from "vue";
import Vuex, { ActionContext } from "vuex";
import firebase from "firebase";
import { vuexfireMutations } from "vuexfire";
import { bindFirebaseRefAction, bindFirestoreRefAction } from "@/helpers/firebase";
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

export type RauActionContext = ActionContext<RauState, RauState>;// TODO: Possible module support?

const getters = {
  runes(state: RauState): Rune[] {
    return state.runes;
  },
  messages(state: RauState): { [k: string]: DBMessage } {
    return state.messages;
  },
  db(state: RauState) {
    return db;
  },
  currentChat(state: RauState) {
    return state.currentChat;
  },
  loggedIn(state: RauState) {
    return state.user !== null;
  },
  user(state: RauState): User | null {
    return state.user;
  },
};

const actions = {
  setRunesRef: bindFirestoreRefAction(
    "runes",
    (ref: string) => fs.collection(ref).orderBy("codepoint"),
  ),
  setMessagesRef: bindFirebaseRefAction("messages", (ref: string) => db.ref(ref)),
  async setChat({ commit }: RauActionContext, chat: string) {
    commit("SET_CHAT", chat);

  },
  async setUser({ commit }: RauActionContext, user: User | null) {
    commit("SET_USER", user);

  },
  async logOut() {
    await auth.signOut();
  },
  /*addMessage() {
    //TODO:
  },*/
};

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
  getters,
  actions,
});

type ActionType<F extends (c: ActionContext<any, any>, p?: any) => any> =
  F extends (c: ActionContext<any, any>) => any
  ? () => ReturnType<F>
  : F extends (c: ActionContext<any, any>, p: infer P) => any
    ? (p: P) => ReturnType<F>
    : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as vuex_type_shim from "@/types/vuex";
export type actiontypes = {
  [K in keyof typeof actions]: ActionType<(typeof actions)[K]>;
};

export type gettertypes = {
  [K in keyof typeof getters]: ReturnType<(typeof getters)[K]>;
};
