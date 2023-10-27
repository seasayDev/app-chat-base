export interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: number;
}

export interface NewMessageRequest {
  text: string;
  username: string;
}
