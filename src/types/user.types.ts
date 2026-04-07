import { UserRole } from "../lib/authUtilis";

export interface UserInfo {
    id : string;
    name : string,
    email : string,
    role : UserRole
}


export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}
