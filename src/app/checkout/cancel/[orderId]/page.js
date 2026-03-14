import Link from "next/link";
import { XCircle } from "lucide-react";

export default async function CancelPage({ params }) {
  const { orderId } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-3 rounded-full">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-8">
          Your payment attempt for order #{orderId} was cancelled. No charges were made.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/account/orders"
            className="inline-block bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors"
          >
            Return to Orders
          </Link>
          <Link
            href="/allproducts"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
