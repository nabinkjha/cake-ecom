import { useState } from "react";
import { useRouter } from "next/router";

import { useCart } from "./cart/hooks/useCart";
import { Button, CircularProgress } from "@mui/material";
import { Prisma } from "@prisma/client";
import useStyles from "@/utils/style";
import { useSnackbar } from "notistack";
import axios from "axios";

export default function DeliveryButton({order}:{order:Prisma.Order}) {
  const [loading, setLoading] = useState(false);
  const { cartState ,cartDispatch} = useCart();
  const { userInfo } = cartState;
  const router = useRouter();
  const {loadingDeliver} = cartState;
  const { enqueueSnackbar } = useSnackbar();
  if (!userInfo) {
    return router.push("/login");
  }

  const handleDelivery = async () => {
    setLoading(true);
    try {
      cartDispatch({ type: "DELIVER_REQUEST", payload: "" });
      const { data } = await axios.put(
        `/api/orders/${order.id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setLoading(false);
      cartDispatch({ type: "DELIVER_SUCCESS", payload: data });
      enqueueSnackbar("Order is delivered", { variant: "success" });
    } catch (err) {
      cartDispatch({ type: "DELIVER_FAIL", payload: err });
      enqueueSnackbar(err.message, { variant: "error" });
    }
  }
  return (
    <>
      {loadingDeliver && <CircularProgress />}
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleDelivery}
                    >
                      Deliver Order
                    </Button>
    </>
  );
}
