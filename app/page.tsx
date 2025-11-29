'use client'

import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import VoiceChatDrawer from '@/components/voice-chat-drawer'

export default function Home() {
  const [open, setOpen] = useState(false)

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
      <Dialog open={open} onClose={setOpen} className="relative z-10">
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
                          onClick={() => setOpen(false)}
                          className="relative rounded-md text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex h-full flex-1">
                    <VoiceChatDrawer isOpen={open} onClose={() => setOpen(false)} />
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
