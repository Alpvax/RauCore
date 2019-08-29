export interface DBMessage {
  read: { [k: string]: boolean };
  text: string;
  time: number;
  user: string;
}
