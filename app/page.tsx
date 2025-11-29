'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import VoiceChatDrawer from '@/components/voice-chat-drawer'

function CheckoutForm({ onClose }: { onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExpressCheckout = async (event: any) => {
    if (!stripe) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred');
      setIsProcessing(false);
    } else {
      window.location.href = `${window.location.origin}/success`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Apple Pay */}
      <div>
        <ExpressCheckoutElement
          onConfirm={handleExpressCheckout}
          options={{
            wallets: {
              applePay: 'auto',
              googlePay: 'never',
              paypal: 'never',
              link: 'never',
            },
            buttonType: {
              applePay: 'buy',
            },
          }}
        />
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or pay with card</span>
        </div>
      </div>

      {/* Card Payment Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <PaymentElement options={{ defaultCollapsed: false }} />

        {errorMessage && (
          <div className="text-red-600 text-sm p-3 bg-red-50 rounded">
            {errorMessage}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Pay £50'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Home() {
  const [open, setOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to open payment modal and create PaymentIntent
  const openPaymentModal = async (amount: number = 5000) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://unlaudative-gushingly-nickolas.ngrok-free.dev/api/payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount })
        }
      );

      if (!res.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await res.json();
      setClientSecret(data.clientSecret);
      setPaymentModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to close modal and send contextual update
  const closePaymentModal = (reason: 'cancelled' | 'completed' = 'cancelled') => {
    setPaymentModalOpen(false);

    // Send contextual update to agent
    if (typeof window !== 'undefined' && (window as any).sendAgentContextualUpdate) {
      const message = reason === 'completed'
        ? 'Payment has been successfully completed. User has finished the checkout process.'
        : 'Payment modal has been closed. User cancelled the payment process.';
      (window as any).sendAgentContextualUpdate(message);
    }
  };

  // Send periodic user activity while modal is open to prevent agent interruption
  useEffect(() => {
    if (!paymentModalOpen) return;

    // Send user activity every 2 seconds while modal is open
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).sendAgentUserActivity) {
        (window as any).sendAgentUserActivity();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [paymentModalOpen]);

  // Make functions available globally for the voice agent
  useEffect(() => {
    (window as any).openPaymentModal = openPaymentModal;
    (window as any).closePaymentModal = closePaymentModal;
    return () => {
      delete (window as any).openPaymentModal;
      delete (window as any).closePaymentModal;
    };
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Grand Hotel</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">Rooms</a>
                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Amenities</a>
                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Dining</a>
                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">Contact</a>
                <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Book Now</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-75"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Experience Luxury Like Never Before</h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-100">Discover the perfect blend of comfort, elegance, and world-class service at Grand Hotel. Your unforgettable stay begins here.</p>
          <div className="mt-10 flex gap-4">
            <button className="rounded-md bg-white px-8 py-3 text-base font-medium text-indigo-600 hover:bg-gray-50">Explore Rooms</button>
            <button
              onClick={() => setOpen(true)}
              className="rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700"
            >
              Chat with us
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">World-Class Amenities</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need for a perfect stay</p>
            <p className="mt-6 text-lg leading-8 text-gray-600">From luxurious spa treatments to fine dining experiences, we offer everything you need to relax and rejuvenate.</p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xl">🏊</span>
                  </div>
                  Infinity Pool
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Relax in our rooftop infinity pool with stunning city views. Open 24/7 for your convenience.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xl">🍽️</span>
                  </div>
                  Fine Dining
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Experience culinary excellence at our Michelin-starred restaurant featuring international cuisine.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xl">💆</span>
                  </div>
                  Luxury Spa
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Rejuvenate your body and mind at our award-winning spa with expert therapists and treatments.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Rooms</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">Choose from our selection of beautifully designed rooms and suites</p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="h-48 w-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900">Deluxe Room</h3>
                <p className="mt-2 text-gray-600">Spacious room with king-size bed, city views, and modern amenities.</p>
                <p className="mt-4 text-2xl font-bold text-indigo-600">$299/night</p>
                <button className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">View Details</button>
              </div>
            </div>
            <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="h-48 w-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900">Executive Suite</h3>
                <p className="mt-2 text-gray-600">Luxury suite with separate living area, premium bedding, and workspace.</p>
                <p className="mt-4 text-2xl font-bold text-indigo-600">$499/night</p>
                <button className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">View Details</button>
              </div>
            </div>
            <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="h-48 w-full bg-gradient-to-br from-pink-400 to-pink-600"></div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900">Presidential Suite</h3>
                <p className="mt-2 text-gray-600">Ultimate luxury with panoramic views, private terrace, and butler service.</p>
                <p className="mt-4 text-2xl font-bold text-indigo-600">$899/night</p>
                <button className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Grand Hotel</h3>
              <p className="mt-4 text-gray-400">Experience luxury and comfort in the heart of the city.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Contact</h3>
              <p className="mt-4 text-gray-400">123 Luxury Avenue<br/>New York, NY 10001<br/>Phone: (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Follow Us</h3>
              <div className="mt-4 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-300">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-gray-300">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-gray-300">Twitter</a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400">&copy; 2025 Grand Hotel. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chat Drawer */}
      <Dialog
        open={open}
        onClose={() => {
          // Prevent closing drawer if payment modal is open
          if (!paymentModalOpen) {
            setOpen(false);
          }
        }}
        className="relative z-10"
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="relative flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-base font-semibold text-gray-900">Chat with us</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => {
                            // Prevent closing drawer if payment modal is open
                            if (!paymentModalOpen) {
                              setOpen(false);
                            }
                          }}
                          className="relative rounded-md text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          disabled={paymentModalOpen}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex h-full flex-1">
                    <VoiceChatDrawer
                      isOpen={open}
                      onClose={() => {
                        // Prevent closing drawer if payment modal is open
                        if (!paymentModalOpen) {
                          setOpen(false);
                        }
                      }}
                    />
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={paymentModalOpen && !!clientSecret} onClose={() => closePaymentModal('cancelled')} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-5">
          <DialogPanel className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-8">
            <button
              onClick={() => closePaymentModal('cancelled')}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
            >
              ✕
            </button>

            <DialogTitle className="text-2xl font-bold mb-2 text-gray-900">
              Confirm Late Checkout
            </DialogTitle>
            <p className="text-sm text-gray-600 mb-6">
              Complete your payment to extend your checkout time until 3:00 PM.
            </p>

            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#4f46e5',
                    },
                  },
                  paymentMethodOrder: ['card'],
                }}
              >
                <CheckoutForm onClose={() => closePaymentModal('cancelled')} />
              </Elements>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
