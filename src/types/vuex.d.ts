/* eslint-disable @typescript-eslint/prefer-function-type */
import { Dispatch } from "vuex";
import { actiontypes } from "@/store";
declare module "vuex" {
  type PickAction<A extends keyof actiontypes> = (actiontypes)[A];
  type ExtractPayload<T> = T extends () => any ? never : T extends (p: infer P) => any ? P : never;
  interface Dispatch {
    <N extends keyof actiontypes, A = PickAction<N>, P = ExtractPayload<A>>(
      action: N,
      //...payload: never extends P ? never[] : [P]
      ...payload: A extends () => any ? never[] : A extends (p: infer P) => any ? [P] : never[]
    ): A extends Action<any, infer R> ? R: never;
  }
}
