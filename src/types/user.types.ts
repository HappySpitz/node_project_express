import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

export interface ISeller extends IUser {
  lastName: string;
  type: string;
  phone: string;
  avatar?: string;
}

export type IManager = IUser;
