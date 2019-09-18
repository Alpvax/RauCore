import { Ref } from "@vue/composition-api";
import {
  useGetters as mapGetters,
  useActions as mapActions,
} from "@u3u/vue-hooks";
import {
  gettertypes as gtypes,
  actiontypes as atypes,
} from "@/store";

export function useGetters<K extends keyof gtypes>(...names: K[]): { [N in K]: Ref<gtypes[N]> } {
  return mapGetters(names) as { [N in K]: Ref<gtypes[N]> };
}

export function useActions<K extends keyof atypes>(...names: K[]): { [N in K]: atypes[N] } {
  return mapActions(names) as { [N in K]: atypes[N] };
}

//export function useStore
