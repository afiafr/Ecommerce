import { NextFunction, Request, Response } from "express";

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction, //eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<void | Response<any, Record<string, any>>>;

export type ProductType = {
  id: string;
  name: string;
  group: string;
  msrp: number;
  price: number;
  status: "Available" | "Unavailable";
  category: "Laptop" | "Mobile" | "Tablet" | "Accessory";
};

export interface BaseQuery {
  name?: { $regex: RegExp; $options: string };
  status?: string;
  group?: string;
  price?: { $lte: number };
  category?: string;
}

export interface ProductFilters {
  search?: string;
  status?: string;
  category?: string;
  price?: string;
  page?: number;
  sort?: string;
  limit?: number;
}

export type OrderItemType = {
  name: string;
  price: number;
  quantity: number;
  productId: string;
};
