export interface DBMessage {
  read: { [k: string]: boolean };
  text: string;
  time: number;
  user: string;
}

export interface DBUser {
  access: "blocked" | "basic" | "collaborator" | "moderator" | "administrator";
  colour: { [K in "r" | "g" | "b"]: number };
  conversations?: { [k: string]: string };
  name: string;
  provider: "github" | "google" | "facebook" | "twitter";
}
