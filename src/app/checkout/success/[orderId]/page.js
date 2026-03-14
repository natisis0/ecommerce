"use client";

import { useEffect, useState, use } from "react";
import { finalizeOrderAction } from "@/_lib/payment-action";
import Link from "next/link";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

import { Suspense } from "react";

function SuccessPageInner({ params, searchParams }) {
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(searchParams);
  
  const orderId = unwrappedParams.orderId;
  const sessionId = unwrappedSearchParams.session_id;

  const [status, setStatus] = useState("loading"); // loading, success, error
  const [error, setError] = useState(null);

  useEffect(() => {
    async function finalize() {
      if (!sessionId) {
        setStatus("error");
        setError("Missing session ID");
        return;
      }

      const result = await finalizeOrderAction(orderId, sessionId);
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(result.error);
      }
    }

    finalize();
  }, [orderId, sessionId]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
        <p className="text-gray-600">Verifying payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Failed
          </h1>
          <p className="text-gray-600 mb-8">{error || "Something went wrong"}</p>
          <Link
            href="/account/orders"
            className="inline-block bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order #{orderId} is now being processed.
        </p>
        <Link
          href="/account/orders"
          className="inline-block bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage(props) {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
        <p className="text-gray-600">Loading payment details...</p>
      </div>
    }>
      <SuccessPageInner {...props} />
    </Suspense>
  );
}
