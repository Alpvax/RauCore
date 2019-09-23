import { Rune } from "@/types";

export const runesToString = (runes: (Rune | string)[]): string => {
  return runes.reduce((str: string, rune) =>
    str += (typeof rune === "string") ? rune : String.fromCharCode(rune.codepoint), "");
};
