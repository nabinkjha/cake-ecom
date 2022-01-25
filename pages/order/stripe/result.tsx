import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCart } from "../../../components/cart/hooks/useCart";
import { useSnackbar } from "notistack";
import { getError } from "../../../utils/error";
import axios from "axios";

  const updateOrderStatus = async function (sessionid:string,orderid: number) {
  const { cartState } = useCart();
  const { userInfo } = cartState;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
    try {
      const { data } = await axios.put(
        `/api/payment/stripe/pay/${sessionid}?orderid=${orderid}`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        }
      );
      if(data?.order?.id >0){
        enqueueSnackbar("Order is paid", { variant: "success" });
        router.push(`/order/stripe/${data.order.id}`);
      }
     
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  }

const ResultPage: NextPage = () => {
  const router = useRouter();
  if (router.query.session_id) {// Runs twice and value is NULL for first time.
    updateOrderStatus(router.query.session_id,router.query.orderid);
  }

  return (
  <>
    <h1>Payment is updated...</h1>
  </>
  );
};

export default ResultPage;