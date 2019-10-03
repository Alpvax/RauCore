import Vue from "vue";
import Vuex, { ActionContext, ActionTree } from "vuex";
import firebase from "firebase";
import { vuexfireMutations } from "vuexfire";
import {
  bindFirebaseRefAction,
  bindFirestoreRefAction,
  unbindFirebaseRefAction,
} from "@/helpers/firebase";
import { Rune, User } from "@/types";
import { FilteredObj } from "@/types/utils";
import { DBMessage, DBUser } from "@/types/firebase/rtdb";
import * as runesmodule from "./runes";

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
  messages: { [k: string]: { [k: string]: DBMessage }};
  settings: {};
  userid: string;
  user: DBUser | null;
  currentChat: string;
}

export type RauActionContext<T> = ActionContext<T, RauState>;// TODO: Possible module support?

const getters = {
  getRuneByName(state: RauState): (name: string) => Rune | undefined {
    return name => state.runes.find(r => r.name === name);
  },
  runes(state: RauState): Rune[] {
    return state.runes;
  },
  messages(state: RauState): { [k: string]: { [k: string]: DBMessage }} {
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
    if (state.user) {
      let { name, colour } = state.user!;
      let { r, g, b } = colour;
      return {
        id: state.userid,
        name,
        colour: [r, g, b],
      };
    } else {
      return null;
    }
  },
};

const actions = {
  setRunesRef: bindFirestoreRefAction(
    "runes",
    (ref: string) => fs.collection(ref).orderBy("codepoint"),
  ),
  setMessagesRef: bindFirebaseRefAction("messages", (ref: string) => db.ref(ref)),
  async setChat({ commit }: RauActionContext<RauState>, chat: string) {
    commit("SET_CHAT", chat);

  },
  async setUserID({ commit, dispatch }: RauActionContext<RauState>, userid: string | null) {
    commit("SET_USER_ID", userid || "");
    if (userid) {
      dispatch("setUser", userid);
    } else {
      dispatch("removeUser");
    }
  },
  setUser: bindFirebaseRefAction(
    "user",
    (ref: string) => db.ref("users").child(ref),
  ),
  removeUser: unbindFirebaseRefAction("user"),
  /*({ commit }: RauActionContext, userid: string) {
    let user: User = {
      id: userid,
      name: userid,
    };
    commit("SET_USER", user);
    db.ref("users").child(userid).on("value", (snap) => {
      commit("SET_USER", );
    });

  },*/
  async logOut() {
    await auth.signOut();
  },
  /*addMessage() {
    //TODO:
  },*/
};

const modules = {
  runesmodule: {
    getters: runesmodule.getters,
    actions: runesmodule.actions,
  },
};

export default new Vuex.Store<RauState>({
  state: {
    runes: [],
    messages: {},
    settings: {},
    userid: "",
    user: null,
    currentChat: "broadcast",
  },
  mutations: {
    SET_USER_ID(state, userid: string) {
      state.userid = userid;
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

type NamespacedActionType<A> = A extends (c: ActionContext<any, any>, p?: any) => any
  ? ActionType<A>
  : A extends { root?: false | undefined; handler: (c: ActionContext<any, any>, p?: any) => any }
    ? ActionType<A["handler"]>
    : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as vuex_type_shim from "@/types/vuex";
export type actiontypes = {
  [K in keyof typeof actions]: NamespacedActionType<(typeof actions)[K]>;
};

export type gettertypes = {
  [K in keyof typeof getters]: ReturnType<(typeof getters)[K]>;
};

export type namespaced = FilteredObj<{
  actions: {
    [N in keyof typeof modules]: typeof modules[N] extends {actions: {[key: string]: any}}
      ? {
          [K in keyof typeof modules[N]["actions"]]:
            NamespacedActionType<typeof modules[N]["actions"][K]>
        }
      : never;
  };
  getters: {
    [N in keyof typeof modules]: typeof modules[N] extends {getters: object}
      ? {
          [K in keyof typeof modules[N]["getters"]]: ReturnType<
            (typeof modules[N]["getters"][K]) extends (...args: any[]) => any
            ? typeof modules[N]["getters"][K]
            : () => any
          >;
        }
      : never;
  };
}>;

declare function addModuleFunc<T, N extends string, K extends string>
(namespacedKey: N, key: K, func: T): {
  [P in N | K]: T;
};
addModuleFunc("module/key", "key", () => console.log("NOOP"));
