import { RauActionContext } from "@/store";
import { firebaseAction, firestoreAction } from "vuexfire";
import firebase from "firebase";

type Firestore = (app?: firebase.app.App) => firebase.firestore.Firestore;
type Firebase = (app?: firebase.app.App) => firebase.database.Database;

/*type FSRefMapper<R> = (
    ref: R,
    firestore: (app?: firebase.app.App) => firebase.firestore.Firestore
  ) => firebase.firestore.Query
  | firebase.firestore.CollectionReference
  | firebase.firestore.DocumentReference;*/
type FSBindReturn<R extends (ref: any, fs: any) => any> =
  Promise<ReturnType<R> extends firebase.firestore.DocumentReference
  ? firebase.firestore.DocumentData
  : firebase.firestore.DocumentData[]>;

type FirestoreAction<
    ModuleState,
    M extends firebase.firestore.Query
    | firebase.firestore.CollectionReference
    | firebase.firestore.DocumentReference,
    R
  > = (context: RauActionContext<ModuleState>, ref?: R) =>
  // eslint-disable-next-line no-undef
  (typeof ref extends undefined
  ? void
  : M extends firebase.firestore.DocumentReference
    ? firebase.firestore.DocumentData
    : firebase.firestore.DocumentData[]);


type FirestoreRefMapperContext<R> = {
  bind: (ref: R) => Promise<R extends firebase.firestore.DocumentReference
    ? firebase.firestore.DocumentData
    : firebase.firestore.DocumentData[]>;
  unbind: () => void;
  firestore: typeof firebase.firestore;
};
/*export function firestoreRefAction<ModuleState, R>(
  key: string,
  refMapper: (
    ref: R,
    firestore: (app?: firebase.app.App) => firebase.firestore.Firestore
  ) => firebase.firestore.Query
  | firebase.firestore.CollectionReference
  | firebase.firestore.DocumentReference
): (context: RauActionContext<ModuleState>) => void;*/
export function firestoreRefAction<
  ModuleState, RefType, MapperReturn extends
    firebase.firestore.Query
  | firebase.firestore.CollectionReference
  | firebase.firestore.DocumentReference
>(
  key: string,
  refMapper: (
    ref: RefType,
    context: FirestoreRefMapperContext<MapperReturn>,
  ) => MapperReturn
): (context: RauActionContext<ModuleState>, ref?: RefType) =>
// eslint-disable-next-line no-undef
Promise<(ReturnType<typeof refMapper> extends firebase.firestore.DocumentReference
  ? firebase.firestore.DocumentData
  : firebase.firestore.DocumentData[])
| void> {
  return firestoreAction(async ({ bindFirestoreRef, unbindFirestoreRef }, ref: RefType) => {
    if (ref !== undefined) {
      let d = bindFirestoreRef(key, refMapper(ref, firebase.firestore) as MapperReturn);
      return d;
    } else {
      return unbindFirestoreRef(key);
    }
  }) as ReturnType<typeof firestoreRefAction>;
}

export function bindFirestoreRefAction<ModuleState, R>(
  key: string,
  refMapper: (ref: R) =>
      firebase.firestore.Query
      | firebase.firestore.CollectionReference
      | firebase.firestore.DocumentReference
): (context: RauActionContext<ModuleState>, ref: R) =>
    Promise<ReturnType<typeof refMapper> extends firebase.firestore.DocumentReference
    ? firebase.firestore.DocumentData
    : firebase.firestore.DocumentData[]> {
  return firestoreAction(
    async ({ bindFirestoreRef }, ref: R) =>
      bindFirestoreRef(key, refMapper(ref) as firebase.firestore.Query)
  ) as ReturnType<typeof bindFirestoreRefAction>;
}

export function bindFirebaseRefAction<ModuleState, R>(
  key: string,
  refMapper: (ref: R) => firebase.database.Reference | firebase.database.Query
): (context: RauActionContext<ModuleState>, ref: R) => Promise<firebase.database.DataSnapshot> {
  return firebaseAction(
    async ({ bindFirebaseRef }, ref: R) =>
      bindFirebaseRef(key, refMapper(ref))
  ) as ReturnType<typeof bindFirebaseRefAction>;
}

export function unbindFirebaseRefAction<ModuleState, R>(
  key: string,
): (context: RauActionContext<ModuleState>) => void {
  return firebaseAction(
    async ({ unbindFirebaseRef }) =>
      unbindFirebaseRef(key)
  ) as ReturnType<typeof unbindFirebaseRefAction>;
}
