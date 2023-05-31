import { IManager, ISeller } from "./user.types";

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export type ITokenPayload =
  | Pick<ISeller, "_id" | "name">
  | Pick<IManager, "_id" | "name">;

export type IActionTokenPayload = Pick<ISeller, "_id">;
