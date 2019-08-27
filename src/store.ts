import Vue from 'vue';
import Vuex from 'vuex';
import firebase from "firebase";
import { vuexfireMutations, firebaseAction } from "vuexfire";
import Rune from "./types/Runes";

const firebaseConfig = {
  apiKey: "AIzaSyBBpBbncl_mEM2NwZIBKL3Fe11CPOULT58",
  authDomain: "rau.firebaseapp.com",
  databaseURL: "https://rau.firebaseio.com",
  projectId: "firebase-rau",
  storageBucket: "firebase-rau.appspot.com",
  messagingSenderId: "248482438873",
  appId: "1:248482438873:web:1f9f4ea54343c8d7"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

Vue.use(Vuex);

interface RauState {
  runes: Rune[];
  //messages: Message[];
  settings: {};
  user: {};
}

export default new Vuex.Store({
  state: {
    runes: {},
  },
  mutations: {
    ...vuexfireMutations,
  },
  getters: {
    runes(state): Rune[] {
      return Object.entries(state.runes).map(([name, rune]: [string, any]) => {
        let r: Rune = {
          name,
          codepoint: rune.codePoint as number,
          category: rune.category as "letters" | "numbers" | "other",
          pillared: !!rune.pillared,
          index: rune.index,
        };
        if (rune.latin) {
          r.latinInput = rune.latin;
        }
        return r;
      });
    },
    db(state) {
      return db;
    },
  },
  actions: {
    setRunesRef: firebaseAction(({
      bindFirebaseRef,
    }, ref) => {
      bindFirebaseRef("runes", db.ref(ref));
    }),
    /*setMessagesRef: firebaseAction(({
      bindFirebaseRef
    }, ref) => {
      bindFirebaseRef("messages", ref)
    }),
    addMessage() {
      //TODO:
    },
    login() {

    },*/
  },
})
