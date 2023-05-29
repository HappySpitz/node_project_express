import {IManager, ISeller} from "./user.types";

export type ICredentials = Pick<ISeller, "email" | "password"> | Pick<IManager, "email" | "password">;