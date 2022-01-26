import { useState } from "react";
import { useRouter } from "next/router";

import { useCart } from "./cart/hooks/useCart";
import { Prisma } from "@prisma/client";
import useStyles from "@/utils/style";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { getError } from "@/utils/error";
import { useSnackbar } from "notistack";

export default function PayPalBuy({order}:{order:Prisma.Order}) {
  const { cartState,cartDispatch } = useCart();
  const router = useRouter();
  const classes = useStyles();
  const {  userInfo} =  cartState;
  const {totalPrice } = order;
  const { enqueueSnackbar } = useSnackbar();
  if (!userInfo) {
    return router.push("/login");
  }

 
  function createOrder(data: any, actions: any) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID: number) => {
        return orderID;
      });
  }
  function onApprove(data: any, actions: any) {
    return actions.order.capture().then(async function (details: any) {
      try {
        cartDispatch({ type: "PAY_REQUEST", payload: null });
        const { data } = await axios.put(
          `/api/order/paypal/${order.id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        cartDispatch({ type: "PAY_SUCCESS", payload: data });
        enqueueSnackbar("Order is paid", { variant: "success" });
      } catch (err) {
        cartDispatch({ type: "PAY_FAIL", payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: "error" });
      }
    });
  }
  function onError(err: any) {
    enqueueSnackbar(getError(err), { variant: "error" });
  }

  return (
    <>
      {userInfo && (
        <div className={classes.fullWidth}>
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
        ></PayPalButtons>
      </div>
      )}
    </>
  );
}
