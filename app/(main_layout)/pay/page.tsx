'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

import useUser from '@/hooks/useUser'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm() {
    const stripe = useStripe()
    const elements = useElements()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [, setPaymentStatus] = useState<'initial' | 'processing' | 'success' | 'error'>('initial')
    const { currentUser } = useUser();
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsLoading(true)

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        })

        if (error) {
            setErrorMessage(error.message ?? 'An unknown error occurred')
            setPaymentStatus('error')
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setPaymentStatus('success')

            await axios.patch(`/api/users?user=${currentUser?._id}`, {
                pay: 'ok'
            }).then(() => {
                Swal.fire('New You Are the Premium Member')
                router.push('/');
            })

        } else {
            setErrorMessage('An unexpected error occurred.')
            setPaymentStatus('error')
        }

        setIsLoading(false)
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <PaymentElement />
            <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!stripe || isLoading}
                type="submit"
            >
                {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
        </form>
    )
}

export default function StripePaymentComponent() {
    const [clientSecret, setClientSecret] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
    }, [])

    if (!clientSecret) {
        return <div className="text-center">Loading...</div>
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Make a Payment</h2>
                <Elements options={{ clientSecret }} stripe={stripePromise}>
                    <PaymentForm />
                </Elements>
            </div>
        </div>
    )
}