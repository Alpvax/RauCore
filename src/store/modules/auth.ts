import { User } from "@/types";
import { getStoreBuilder } from "vuex-typex";
import { RauState } from "../index";
import { auth as fbAuth } from "firebase";

export default function init() {
  fbAuth().onAuthStateChanged(function(user) {
    actions.setUser(user ? user.uid : null);
  });
}

type AuthStoreState = {
  user: User | null;
}

const builder = getStoreBuilder<RauState>();/*.module<AuthStoreState>("<namespace>", {
  user: null,
});*/

namespace mutations {
  export const setUser = builder.commit((store, user: User | null) => store.user = user, "setUser");
}

export namespace getters {
  export const getUser = builder.read(state => state.user, "getUser");
  export const isLoggedIn = builder.read(state => !!state.user, "isLoggedIn");
}

export namespace actions {
  export const setUser = builder.dispatch(async (context, userid: string | null) => {
    if (userid) {
      //TODO: get data from database
      mutations.setUser({
        id: userid,
        name: userid, //TODO: get display name
      });
    } else {
      mutations.setUser(null);
    }
  }, "setUser");
  export const logOut = builder.dispatch(async context => await fbAuth().signOut(), "logOut");
}

//const module: Module<AuthStoreState, any/*??*/> = {
/*  state: {
    user: null,
  },
  mutations: {
    SET_USER(state, user: User | null) {
      state.user = user;
    },
  },
  actions: {
    async setUser({ commit }, userid: string | null) {
      commit("SET_USER", userid);

    },
  },
};

export default module;*/
