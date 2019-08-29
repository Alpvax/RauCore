import { User } from "./User";

export interface ChatMessage {
  id: string;
  sender: User;
  time: number;
  read: Set<string>;
  text: string;
}
