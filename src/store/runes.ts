import { Module } from "vuex";
import { RauState } from "./index";
import { firestoreRefAction } from "@/helpers/firebase";
import { Rune } from "@/types";

type RunesState = {};
type RunesGetter<R> = (state: RunesState, runeGetters: typeof getters, rootState: RauState) => R;

/*function makeGetter<K extends keyof Rune>(state: RunesState, key: K):
  (arg: Rune[K]) => (K extends "name" | "ipa" | "codepoint" | "latinInput"
  ? Rune
  : Rune[]) | undefined {
  return arg => state.find(r => r[key] === arg);
}*/
function makeGetter <K extends Exclude<keyof Rune, "category" | "pillared" | "index">>(key: K):
  (state: RunesState, runeGetters: any/*typeof getters*/, rootState: RauState) =>
    (filter: Rune[K]) => (Rune | undefined) {/*
    (state: RunesState, runeGetters: typeof getters, rootState: RauState) =>
      (filter: Rune[K]) => Rune | undefined {*/
  return (state: RunesState, runeGetters: typeof getters, rootState: RauState) =>
    filter => rootState.runes.find(r => r[key] === filter);
}

export const getters = {
  byName: makeGetter("name"),
  byLatin: makeGetter("latinInput"),
  byCodepoint: makeGetter("codepoint"),
};

export const actions = {
  setupFirebase: {
    root: true,
    handler: firestoreRefAction(
      "runes",
      (ref: string, { firestore }) => firestore().collection(ref).orderBy("codepoint"),
    ),
    /*handler: bindFirestoreRefAction(
      "runes",
      (ref: string) => fs.collection(ref).orderBy("codepoint"),
    ),*/
  },
};

export const runesModule: Module<RunesState, RauState> = {
  namespaced: true,
  getters,
  actions,
};
export default runesModule;
