import { Rune } from "@/types";

export const runesToString = (runes: Rune[]): string => {
  return runes.reduce((str, rune) =>
    str += (typeof rune === "string") ? rune : String.fromCharCode(rune.codepoint), "");
};
