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

/**
 * Function mapping the action parameter to a firestore bind argument,
 * if return value is `null`, data will be unbound
*/
type RefMapper<T, R extends
  firebase.firestore.Query
  | firebase.firestore.CollectionReference
  | firebase.firestore.DocumentReference
  | null
> = (ref: T, context: {
  firestore: typeof firebase.firestore;
}) => R | null/*
  firebase.firestore.Query
  | firebase.firestore.CollectionReference
  | firebase.firestore.DocumentReference
  | null
>;*/
type RefMapperReturn<M extends (...args: any[]) => any> =
  ReturnType<M> extends infer R | null ? R : never/*
    ? firebase.firestore.DocumentReference extends R
      ? firebase.firestore.DocumentData
      : firebase.firestore.DocumentData[]
    : never;
/*export function firestoreRefAction<ModuleState, R>(
  key: string,
  refMapper: (
    ref: R,
    firestore: (app?: firebase.app.App) => firebase.firestore.Firestore
  ) => firebase.firestore.Query
  | firebase.firestore.CollectionReference
  | firebase.firestore.DocumentReference
): (context: RauActionContext<ModuleState>) => void;*/

/**
 * @param refMapper Function mapping the action parameter to a firestore DocumentReference.
 * If return value is `null`, data will be unbound
*/
export function firestoreRefAction<R>(
  key: string,
  refMapper: RefMapper<R, firebase.firestore.DocumentReference>
): (context: RauActionContext<any>, ref?: R) => Promise<firebase.firestore.DocumentData | null>;
/**
 * @param refMapper Function mapping the action parameter to a firestore Query
 * or CollectionReference.
 * If return value is `null`, data will be unbound
*/
export function firestoreRefAction<R>(
  key: string,
  refMapper: RefMapper<R, firebase.firestore.Query>
): (context: RauActionContext<any>, ref?: R) => Promise<firebase.firestore.DocumentData[] | null>;
export function firestoreRefAction<R>(
  key: string,
  refMapper: RefMapper<R, firebase.firestore.DocumentReference | firebase.firestore.Query>
): (context: RauActionContext<any>, ref?: R) => Promise<any> {
  return firestoreAction(async ({ bindFirestoreRef, unbindFirestoreRef }, ref?: R) => {
    let firestoreRef = ref === undefined
      ?  null
      : await refMapper(ref, { firestore: firebase.firestore });
    if (firestoreRef) {
      //@ts-ignore
      return bindFirestoreRef(key, firestoreRef);
    } else {
      return unbindFirestoreRef(key);
    }
  }) as (context: RauActionContext<any>, ref?: R) => Promise<any>;
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
