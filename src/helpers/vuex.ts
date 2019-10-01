import { Ref } from "@vue/composition-api";
import {
  useGetters as mapGetters,
  useActions as mapActions,
} from "@u3u/vue-hooks";
import {
  gettertypes as gtypes,
  actiontypes as atypes,
  namespaced,
} from "@/store";

/** Non-namespaced version (or individually namespaced) */
export function useGetters<K extends keyof gtypes>(names: K[]): { [N in K]: Ref<gtypes[N]> };
/*export function useGetters<K extends keyof gtypes>(...names: K[]): MappedDict<gtypes, K>;
/** Namespaced version */
export function useGetters
  <N extends keyof namespaced["getters"], K extends keyof namespaced["getters"][N]>
(namespace: N, names: K[]): { [G in K]: Ref<namespaced["getters"][N][G]> };
export function useGetters<
  N extends keyof namespaced["getters"],
  K extends keyof (namespaced["getters"][N]) | gtypes
> (...args: K[] | [N, K[]]) {
  //@ts-ignore
  return mapGetters(...arguments);
}

export function useActions<K extends keyof atypes>(...names: K[]): { [N in K]: atypes[N] } {
  return mapActions(names) as { [N in K]: atypes[N] };
}

//export function useStore
