import React from "react";
import { PrismaClient, Product } from "@prisma/client";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { ProductDetails } from "../../components/ProductDetails";

const prisma = new PrismaClient();

export default function ProductScreen(props: SearchProps) {
  const { productDetail } = props;
  return (<ProductDetails key={productDetail?.id}  productDetail={productDetail}/>);
}

interface SearchProps {
  product: Product;
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
  const productDetail={...product,quantity : 1};
  return {
    props: {
      productDetail: JSON.parse(JSON.stringify(productDetail)) ,
    },
  };
};
