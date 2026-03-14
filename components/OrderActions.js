"use client";

import { useState } from "react";
import { deleteOrderAction } from "@/_lib/order-action";
import { createCheckoutSession } from "@/_lib/payment-action";
import { toast } from "sonner";
import { Trash2, CreditCard, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function OrderActions({ orderId, status, paymentStatus }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // If order is already paid or not pending, don't show actions
  if (status !== "pending" && paymentStatus !== "pending") return null;

  const handleConfirmDelete = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    setIsDeleting(true);
    const result = await deleteOrderAction(orderId);
    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Order canceled successfully");
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsPaying(true);
    toast.loading("Redirecting to payment gateway...", { id: "payment-toast" });

    const result = await createCheckoutSession(orderId);

    if (result.error) {
      toast.error(result.error, { id: "payment-toast" });
      setIsPaying(false);
    } else if (result.url) {
      window.location.href = result.url;
    }
  };

  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            disabled={isDeleting || isPaying}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? "Canceling..." : "Cancel Order"}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Pending Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this pending order? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <button
        onClick={handlePay}
        disabled={isDeleting || isPaying}
        className="flex items-center gap-1.5 text-xs font-bold bg-gray-900 text-white hover:bg-black transition-colors px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {isPaying ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CreditCard className="w-4 h-4" />
        )}
        {isPaying ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
