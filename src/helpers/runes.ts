import { Rune } from "@/types";

export const runesToString = (runes: Rune[]): string => {
  return runes.reduce((str, rune) => str += String.fromCharCode(rune.codepoint), "");
};
