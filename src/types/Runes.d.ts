export interface Rune {
  name: string;
  codepoint: number;
  category: "letters" | "numbers" | "other";
  pillared: boolean;
  index?: number;
  latinInput?: string;
}
