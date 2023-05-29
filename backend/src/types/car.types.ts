import { Types } from "mongoose";

import { ISeller } from "./user.types";

export interface ICar {
  _id?: Types.ObjectId;
  type: string;
  brand: string;
  model: string;
  price: number;
  currency: string;
  region: string;
  text: string;
  year: number;
  color: string;
  photo?: string | string[] | undefined;
  isActive: string;
  seller: ISeller | Types.ObjectId;
  convertedPriceUAH?: number;
  convertedPriceUSD?: number;
  convertedPriceEUR?: number;
}

export interface ICarResponse extends ICar {
  views: Promise<number>;
  viewsByPeriod: Promise<number>;
  averagePrice: Promise<number>;
  averagePriceInUkraine: Promise<number>;
}
