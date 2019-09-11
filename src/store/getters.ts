import { getters as _auth } from "./modules/auth";
export const auth = _auth;
export const getUser = auth.getUser;
export const isLoggedIn = auth.isLoggedIn;
