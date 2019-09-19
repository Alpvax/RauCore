import { RauActionContext } from "@/store";
import { firebaseAction, firestoreAction } from "vuexfire";

export function bindFirestoreRefAction<R>(
  key: string,
  refMapper: (ref: R) =>
      firebase.firestore.Query
      | firebase.firestore.CollectionReference
      | firebase.firestore.DocumentReference
): (context: RauActionContext, ref: R) =>
    Promise<ReturnType<typeof refMapper> extends firebase.firestore.DocumentReference
    ? firebase.firestore.DocumentData
    : firebase.firestore.DocumentData[]> {
  return firestoreAction(
    async ({ bindFirestoreRef }, ref: R) =>
      bindFirestoreRef(key, refMapper(ref) as firebase.firestore.Query)
  ) as ReturnType<typeof bindFirestoreRefAction>;
}

export function bindFirebaseRefAction<R>(
  key: string,
  refMapper: (ref: R) => firebase.database.Reference | firebase.database.Query
): (context: RauActionContext, ref: R) => Promise<firebase.database.DataSnapshot> {
  return firebaseAction(
    async ({ bindFirebaseRef }, ref: R) =>
      bindFirebaseRef(key, refMapper(ref))
  ) as ReturnType<typeof bindFirebaseRefAction>;
}
