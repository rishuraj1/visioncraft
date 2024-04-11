import { NextResponse } from "next/server";
import stripe from "stripe";

import { createTransaction } from "@/lib/actions/transactions.action";
import { eventNames } from "process";

export async function POST(request: Request) {
  const body = await request.text();

  const sign = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sign, endpointSecret);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Webhook Error", error });
  }

  const eventType = event.type;

  if (eventType === "checkout.session.completed") {
    const { id, amount_total, metadata } = event.data.object;

    const transaction = {
      stripeId: id,
      amount: amount_total ? amount_total / 100 : 0,
      plan: metadata?.plan || "",
      credits: Number(metadata?.credits) || 0,
      buyerId: metadata?.buyerId || "",
    };

    const newTransaction = await createTransaction(transaction);
    return NextResponse.json({
      message: "Transaction Created",
      newTransaction,
    });
  }

  return new Response("", { status: 200 });
}
