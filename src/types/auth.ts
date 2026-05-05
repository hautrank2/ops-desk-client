import { UserRole } from "./user";

export type AuthPayloadModel = {
    _id: string;
    username: string;
    role: UserRole
}