import { useState } from "react";
import { useRouter } from "next/router";

import { useCart } from "./cart/hooks/useCart";
import { Button, CircularProgress } from "@mui/material";
import { fetchPostJSON } from "@/utils/api-helpers";
import { redirectToCheckout } from "@/utils/stripe";
import { Prisma } from "@prisma/client";
import useStyles from "@/utils/style";

export default function StripeBuyButton({order}:{order:Prisma.Order}) {
  const [loading, setLoading] = useState(false);
  const { cartState } = useCart();
  const { userInfo } = cartState;
  const router = useRouter();
  const classes = useStyles();
  if (!userInfo) {
    return router.push("/login");
  }

  const handleBuy = async () => {
    setLoading(true);

    const response = await fetchPostJSON(`/api/payment/stripe/${order.id}/cart`,userInfo.token, {order});
  
      if (response.statusCode === 500) {
        console.error(response.message);
        return;
      }
      setLoading(false);
      redirectToCheckout({ id: response.id });

  };

  return (
    <>
      {userInfo && (
        <div className={classes.fullWidth}>
          {loading && <CircularProgress />}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleBuy}
          >
            BUY
          </Button>
        </div>
      )}
    </>
  );
}
