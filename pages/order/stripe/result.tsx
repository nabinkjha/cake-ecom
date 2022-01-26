import { useState, useReact, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";

import { useSnackbar } from "notistack";
import { getError } from "../../../utils/error";
import { useCart } from "@/components/cart/hooks/useCart";
import Layout from "@/components/Layout";

const useOrder = (session_id: string, orderid: number) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { cartState } = useCart();
  const { userInfo } = cartState;

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        if (session_id) {
          const{ data }= await axios.put(
            `/api/payment/stripe/confirm/${session_id}?orderid=${orderid}`,
            {},
            {
              headers: { authorization: `Bearer ${userInfo?.token}` },
            }
          );
          console.log(data);
          setOrder(data?.order);
        }
      } catch (error) {
        setOrder(null);
        enqueueSnackbar(getError(error), { variant: "error" });
      }
      setLoading(false);
    };
    fetchOrder();
  }, [session_id]);
  return { order, loading };
};

const ResultPage: NextPage = () => {
  const router = useRouter();
  const { session_id, orderid } = router.query;
  const { order, loading } = useOrder(session_id, orderid);
   return (
    <Layout>
      <Head>
        <title> Thank you</title>
        <meta name="description" content="Thank you for your purchase" />
      </Head>
      <h1>Payment has been approved by Stripe</h1>
      {loading && <p> Payment update is in progress...</p>}
      {order && (
        <p> Your order is confirmed, with order number: {order.id} </p>
      )}
    </Layout>
  );
};

export default ResultPage;
