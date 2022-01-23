import { useMemo, useContext } from "react";

import  {PaymentStateContext} from "../context/paymentContext";

export const usePayment= () => {
  
  const context = useContext(PaymentStateContext);
  if (context === undefined) {
    throw new Error("context is undefined. useContext() not able to create instance.");
  }
  return useMemo(() => context, [context]);
};
