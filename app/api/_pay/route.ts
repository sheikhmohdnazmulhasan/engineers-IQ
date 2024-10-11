import httpStatus from "http-status";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);
    const amount = Number(parseFloat(String(20 * 100)).toFixed(2));

    // stripe logic

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd'
        });

        return NextResponse.json({
            success: true,
            clientSecret: paymentIntent.client_secret
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "error creating stripe payment intent"
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}