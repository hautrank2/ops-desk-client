import { UserModel } from "./user";

export interface TicketCommentModel {
  _id: string;
  ticketId: string;
  content: string;
  imgUrls?: string[];
  parentId?: string;
  createdBy: UserModel; // or just User if nested, typically it's an object populated with id, name, avatar
  createdAt: string;
  updatedAt: string;
  replies?: TicketCommentModel[];
}
