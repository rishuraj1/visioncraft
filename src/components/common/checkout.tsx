"use client";

import { loadStripe } from "@stripe/stripe-js";

import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { checkoutCredits } from "@/lib/actions/transactions.action";
import { Button } from "../ui/button";

interface CheckoutProps {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}

export default function Checkout({
  plan,
  amount,
  credits,
  buyerId,
}: CheckoutProps) {
  const { toast } = useToast();

  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success"))
      toast({
        title: "Success",
        description: "Your payment was successful",
        duration: 5000,
        className: "success-toast",
      });

    if (query.get("canceled"))
      toast({
        title: "Canceled",
        description: "Your payment was canceled",
        duration: 5000,
        className: "error-toast",
      });
  }, []);

  const onCheckout = async () => {
    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };

    await checkoutCredits(transaction);
  };

  return (
    <form action={onCheckout} method="POST" className="mt-6 w-full">
      <section>
        <Button
          type="submit"
          variant={"outline"}
          className="w-full mt-6 bg-gradient-to-tr from-blue-700 to-blue-900 hover:from-blue-900 hover:to-blue-700 text-white/70 hover:text-white"
        >
          Buy Credit
        </Button>
      </section>
    </form>
  );
}
