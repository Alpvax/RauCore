import { getStoreBuilder } from "vuex-typex";
import { firestoreAction } from "vuexfire";
import { RauState } from "../index";


export default function init() {
  //actions.setRunesRef()
}

const builder = getStoreBuilder<RauState>();

export namespace actions {
  /*export const setRunesRef = builder.dispatch(firestoreAction(async ({ bindFirestoreRef }, ref: string) =>
    bindFirestoreRef("runes", fs.collection(ref).orderBy("codepoint"))
  ))*/
}
