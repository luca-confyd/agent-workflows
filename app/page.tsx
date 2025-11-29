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
      // Payment successful - close modal and send user message
      if (typeof window !== 'undefined' && (window as any).sendAgentUserMessage) {
        (window as any).sendAgentUserMessage('Payment completed successfully for £50 late checkout.');
      }
      if (typeof window !== 'undefined' && (window as any).closePaymentModal) {
        (window as any).closePaymentModal('completed');
      }
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
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred');
      setIsProcessing(false);
    } else {
      // Payment successful - close modal and send user message
      if (typeof window !== 'undefined' && (window as any).sendAgentUserMessage) {
        (window as any).sendAgentUserMessage('Payment completed successfully for £50 late checkout.');
      }
      if (typeof window !== 'undefined' && (window as any).closePaymentModal) {
        (window as any).closePaymentModal('completed');
      }
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
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-neutral-200">
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-light tracking-wider text-neutral-900 uppercase">The Grand</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#rooms" className="text-sm font-light text-neutral-700 hover:text-neutral-900 transition-colors">Rooms</a>
              <a href="#dining" className="text-sm font-light text-neutral-700 hover:text-neutral-900 transition-colors">Dining</a>
              <a href="#experiences" className="text-sm font-light text-neutral-700 hover:text-neutral-900 transition-colors">Experiences</a>
              <a href="#contact" className="text-sm font-light text-neutral-700 hover:text-neutral-900 transition-colors">Contact</a>
              <button
                onClick={() => setOpen(true)}
                className="ml-6 px-6 py-2.5 text-sm font-light text-white bg-neutral-900 hover:bg-neutral-800 transition-colors"
              >
                Concierge
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative h-screen pt-20">
        <div className="absolute inset-0 bg-neutral-900">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/40 to-neutral-900/80"></div>
        </div>
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6">
              A home for the<br />modern traveller
            </h1>
            <p className="text-lg md:text-xl font-light text-neutral-300 mb-12 max-w-2xl mx-auto">
              Heritage craftsmanship meets contemporary design in the heart of the city
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-10 py-4 text-sm font-light text-neutral-900 bg-white hover:bg-neutral-100 transition-colors">
                Book a Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="bg-white py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900 mb-6">
              Everything you need.<br />Nothing you don&apos;t.
            </h2>
            <p className="text-lg font-light text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              We believe in intentional hospitality. Each detail carefully considered,
              each element purposefully placed to create an experience of refined simplicity.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-block text-4xl">🏛️</div>
              </div>
              <h3 className="text-lg font-light text-neutral-900 mb-3">Heritage Architecture</h3>
              <p className="text-sm font-light text-neutral-600 leading-relaxed">
                Victorian elegance reimagined for the contemporary traveler
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-block text-4xl">🍷</div>
              </div>
              <h3 className="text-lg font-light text-neutral-900 mb-3">Curated Dining</h3>
              <p className="text-sm font-light text-neutral-600 leading-relaxed">
                Seasonal menus crafted from locally sourced ingredients
              </p>
            </div>
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-block text-4xl">🎨</div>
              </div>
              <h3 className="text-lg font-light text-neutral-900 mb-3">Art & Culture</h3>
              <p className="text-sm font-light text-neutral-600 leading-relaxed">
                Rotating exhibitions from emerging and established artists
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <div id="rooms" className="bg-white py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900 mb-4">Rooms & Suites</h2>
            <p className="text-lg font-light text-neutral-600">Thoughtfully designed spaces for rest and reflection</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="aspect-[4/5] bg-neutral-200 mb-6 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-neutral-300 to-neutral-400 group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              <h3 className="text-xl font-light text-neutral-900 mb-2">Classic Room</h3>
              <p className="text-sm font-light text-neutral-600 mb-4 leading-relaxed">
                Refined simplicity with curated furnishings and natural light
              </p>
              <p className="text-lg font-light text-neutral-900">From £245</p>
            </div>
            <div className="group">
              <div className="aspect-[4/5] bg-neutral-200 mb-6 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-neutral-400 to-neutral-500 group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              <h3 className="text-xl font-light text-neutral-900 mb-2">Superior Room</h3>
              <p className="text-sm font-light text-neutral-600 mb-4 leading-relaxed">
                Spacious accommodations with workspace and city views
              </p>
              <p className="text-lg font-light text-neutral-900">From £345</p>
            </div>
            <div className="group">
              <div className="aspect-[4/5] bg-neutral-200 mb-6 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-neutral-500 to-neutral-600 group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              <h3 className="text-xl font-light text-neutral-900 mb-2">Signature Suite</h3>
              <p className="text-sm font-light text-neutral-600 mb-4 leading-relaxed">
                Ultimate comfort with separate living area and private terrace
              </p>
              <p className="text-lg font-light text-neutral-900">From £545</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="contact" className="bg-neutral-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div>
              <h3 className="text-lg font-light tracking-wider uppercase mb-6">The Grand</h3>
              <p className="text-sm font-light text-neutral-400 leading-relaxed">
                A carefully curated hotel experience in the heart of the city.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-light tracking-wider uppercase text-neutral-400 mb-6">Visit</h3>
              <p className="text-sm font-light text-neutral-300 leading-relaxed">
                123 Heritage Lane<br/>
                London, W1K 4PL<br/>
                United Kingdom
              </p>
            </div>
            <div>
              <h3 className="text-sm font-light tracking-wider uppercase text-neutral-400 mb-6">Connect</h3>
              <div className="space-y-3">
                <p className="text-sm font-light text-neutral-300">reservations@thegrand.com</p>
                <p className="text-sm font-light text-neutral-300">+44 20 7123 4567</p>
                <div className="flex space-x-6 pt-4">
                  <a href="#" className="text-sm font-light text-neutral-400 hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="text-sm font-light text-neutral-400 hover:text-white transition-colors">Twitter</a>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-800">
            <p className="text-xs font-light text-neutral-500 text-center">
              © 2025 The Grand. All rights reserved.
            </p>
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
