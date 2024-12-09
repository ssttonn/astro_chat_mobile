import IUser from "./IUser";

export enum MessageType {
  Text = "text",
  Image = "image",
  Video = "video",
  Audio = "audio",
}

export enum MessageState {
  Sending = "sending",
  Delivered = "delivered",
  Error = "error",
}

interface IMessage {
  id: string;
  conversationId: string;
  senderId: IUser;
  content: string;
  type: MessageType;
  level: number;
  taggedUsers: IUser[];
  replies: IMessage[];
  seenBy: IUser[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  messageState: MessageState;
}

export default IMessage;
