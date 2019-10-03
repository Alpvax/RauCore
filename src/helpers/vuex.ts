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


import { FilteredObj } from "@/types/utils";
export function useNamespacedGetters<
  N extends keyof namespaced["getters"],
  K extends keyof Extract<namespaced["getters"],N>
>(
  arg: {[M in N]: (keyof namespaced["getters"][M] & K)[]}
): FilteredObj<{
  [M in keyof typeof arg]: {
    [G in K]: G extends keyof namespaced["getters"][M]
      ? namespaced["getters"][M][G]
      : never;
  };
}> {

  return Object.assign({}, ...Object.entries(arg).map(
    //@ts-ignore
    ([namespace, keys]: [N, string[]]) => {
      return {
        [namespace]: {
          ...mapGetters(namespace, keys),
        },
      };
    }));
}

let test = useNamespacedGetters({
  runesmodule: ["byName", "byCodepoint"],
  testmodule2: ["testVal"],
});

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
