'use client'

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import React, { useState } from "react";

const CheckOutForm = () => {

 

  const [payment,setPayment]= useState<any>(false)
  const stripe: any = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (elements == null) {
      return;
    }
    const { error: submitError } = await elements.submit();
    if (submitError) {
      return;
    }

    const res = await fetch("/api/create-intent", {
      method: "POST",
      body: JSON.stringify({
        amount: 58,
      }),
    });
    const secretKey = await res.json();
    console.log(secretKey);
    const { error } = await stripe.confirmPayent({
      clientSecret: secretKey,
      elements,
      confirmParams: {
        return_url: "http//localhost:3000/",
      },
    });
     setPayment(true)
  };
  return (
    <div className="flex h-[90vh] flex-col justify-center items-center">
        <h2 className="text-xl font-bold text-slate-800">Payment</h2>
      <form onClick={handleSubmit} className="max-w-md mt-6">
        <PaymentElement />
        <button type="submit" disabled={!stripe || !elements} className="w-full p-2 bg-yellow-400 rounded-md mt-3">
          Pay
        </button>
        {payment?(<p>Payment Done.....</p>):(null)}
      </form>
    </div>
  );
};

export default CheckOutForm;
