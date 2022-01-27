import { useCart } from "@/components/cart/hooks/useCart";
import axios from "axios";
import { getError } from "./error";

export async function fetchGetJSON(url: string) {
    try {
      const data = await fetch(url).then((res) => res.json());
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  export async function fetchPostJSON(url: string,token:string, data?: {}) {
    try {
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
      });
      return await response.json(); // parses JSON response into native JavaScript objects
    } catch (err) {
      throw new Error(err.message);
    }
  }
  const fetchOrder = async (orderId:number,token:string, cartDispatch:any) => {
    try {
      cartDispatch({ type: "ORDER_FETCH_REQUEST", payload: null });
      const { data } = await axios.get(`/api/orders/${orderId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      cartDispatch({ type: "ORDER_FETCH_SUCCESS", payload: data });
    } catch (err) {
      cartDispatch({ type: "ORDER_FETCH_FAIL", payload: getError(err) });
    }
  };
  const fetchOrders = async (token:string, cartDispatch:any) => {
    try {
      cartDispatch({ type: "ORDERS_FETCH_REQUEST", payload: null });
      const { data } = await axios.get(`/api/orders`, {
        headers: { authorization: `Bearer ${token}` },
      });
      cartDispatch({ type: "ORDERS_FETCH_SUCCESS", payload: data });
    } catch (err) {
      cartDispatch({ type: "ORDERS_FETCH_FAIL", payload: getError(err) });
    }
  };

  const fetchSummaryData = async (token:string, cartDispatch:any) => {
    try {
      cartDispatch({ type: 'SUMMARY_FETCH_REQUEST' });
      const { data } = await axios.get(`/api/admin/summary`, {
        headers: { authorization: `Bearer ${token}` },
      });
      cartDispatch({ type: 'SUMMARY_FETCH_SUCCESS', payload: data });
    } catch (err) {
      cartDispatch({ type: 'SUMMARY_FETCH_FAIL', payload: getError(err) });
    }
  };
  export  {fetchOrder,fetchOrders,fetchSummaryData};