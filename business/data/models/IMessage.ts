import IUser from "./IUser";

export enum MessageType {
  Text = "text",
  Image = "image",
  Video = "video",
  Audio = "audio",
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
}

export default IMessage;
