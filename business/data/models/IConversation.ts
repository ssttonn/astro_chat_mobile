import IMessage from "./IMessage";
import IUser from "./IUser";

export enum ConversationType {
  Private = "private",
  Group = "group",
}

export enum ConversationMode {
  Private = "private",
  Public = "public",
}

interface IConversation {
  id: string;
  members: IUser[];
  name: string;
  type: ConversationType;
  mode: ConversationMode;
  lastMessage: IMessage;
  createdAt: Date;
  updatedAt: Date;
}

export default IConversation;
