import { useMemo, useContext } from "react";

import  {CartStateContext} from "../context/cartContext";

export const useCart = () => {
  
  const context = useContext(CartStateContext);
  if (context === undefined) {
    throw new Error("context is undefined. useContext() not able to create instance.");
  }
  return useMemo(() => context, [context]);
};
