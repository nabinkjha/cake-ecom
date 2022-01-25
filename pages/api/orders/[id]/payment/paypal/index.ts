import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    res.status(200).json({message:`Paypal is working for order id ${req.query.id}`});
  }
  