import type Prisma from "@prisma/client";

export type Action =
  | { type: "addProduct"; payload:ItemInBasket }
  | { type: "deleteProduct"; payload: ItemInBasket };

export type State = {
  readonly cartitems: Array<ItemInBasket>;
  readonly totalPrice: number;
};

export interface ItemInBasket{
  id: number
  name: string
  slug: string
  description: string
  category: string
  imageUrl: string
  quantity:number
  countInStock:number
  price:number
  rating:number
}