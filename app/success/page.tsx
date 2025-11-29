export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className="bg-white p-12 rounded-xl shadow-lg text-center max-w-lg w-full">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl">
          ✓
        </div>

        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Payment Successful!
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Thank you for your payment of <span className="font-semibold text-gray-900">£50.00</span>
        </p>

        <p className="text-sm text-gray-500">
          A confirmation email has been sent to your email address.
        </p>

        <a
          href="/"
          className="mt-8 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
