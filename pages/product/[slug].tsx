import React from "react";
import { PrismaClient, Product } from "@prisma/client";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { ProductDetails } from "../../components/ProductDetails";
import { ItemInBasket } from "../../components/cart/context/types";

const prisma = new PrismaClient();

export default function ProductScreen(props: SearchProps) {
  const { itemInBasket } = props;
  return (<ProductDetails key={itemInBasket?.id} {...itemInBasket} />);
}

interface SearchProps {
  itemInBasket: ItemInBasket;
}

interface Params extends ParsedUrlQuery {
    slug: string,
  }

export const getServerSideProps: GetServerSideProps<SearchProps> = async (
  context
) => {

  const param = context.params as Params;
  const product = await prisma.product.findUnique({
    where: {
      slug: param.slug
    },
    include:{
        productCategory:true,
        reviews:true
    }
  });
  const itemInBasket={...product};
  itemInBasket.category= product?.productCategory?.name,
  itemInBasket.quantity = 1;
  delete itemInBasket.productCategory;
  return {
    props: {
      itemInBasket: itemInBasket,
    },
  };
};
