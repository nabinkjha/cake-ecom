import { PaymentAction, PaymentState } from "./types";
import {
  createContext,
  useReducer,
  useMemo,
} from "react";
import { paymentReducer } from "./reducers/paymentReducer";

type Dispatch = (action: PaymentAction) => void;
type PaymentProviderProps = { readonly children: React.ReactNode };

export const PaymentStateContext = createContext<
  { state: PaymentState; dispatch: Dispatch } | undefined
>(undefined);

export const initialPaymentState: PaymentState = {
  loading: true,
  order: {},
  error: '',
  successPay:'',
loadingDeliver: '',
successDeliver:''
};

export function PaymentProvider({ children }: PaymentProviderProps) {
  const [paymentState,paymentDispatch]= useReducer(paymentReducer, initialPaymentState);
  const value = useMemo(() => ({ paymentState, paymentDispatch }), [paymentState]);
  return (
    <PaymentStateContext.Provider value={value}>
      {children}
    </PaymentStateContext.Provider>
  );
}
