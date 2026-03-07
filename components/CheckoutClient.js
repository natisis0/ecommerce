"use client";

import React, { useState, useActionState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { storeActions } from "../store/CartStore";
import { createOrderAction } from "@/_lib/order-action";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  Phone,
  User,
  ChevronLeft,
  CheckCircle2,
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import {
  createAddressAction,
  updateAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/_lib/address-action";

// ─── Address Form ────────────────────────────────────────────

function AddressForm({ address, onCancel }) {
  const isEditing = !!address;

  const action = isEditing ? updateAddressAction : createAddressAction;
  const [state, formAction, isPending] = useActionState(action, {});

  useEffect(() => {
    if (state?.success) {
      toast.success(
        isEditing
          ? "Address updated successfully"
          : "Address added successfully",
      );
      onCancel();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, isEditing, onCancel]);

  return (
    <form action={formAction} className="space-y-5">
      {isEditing && (
        <input type="hidden" name="address_id" value={address.id} />
      )}

      {/* Full Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="full_name"
              type="text"
              required
              defaultValue={address?.full_name || ""}
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="phone"
              type="tel"
              required
              defaultValue={address?.phone || ""}
              placeholder="+1 234 567 890"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Country & City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            name="country"
            type="text"
            required
            defaultValue={address?.country || ""}
            placeholder="United States"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <input
            name="city"
            type="text"
            required
            defaultValue={address?.city || ""}
            placeholder="New York"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      {/* State & Postal Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            State / Province
          </label>
          <input
            name="state"
            type="text"
            defaultValue={address?.state || ""}
            placeholder="NY"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Postal Code
          </label>
          <input
            name="postal_code"
            type="text"
            defaultValue={address?.postal_code || ""}
            placeholder="10001"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Address Lines */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <input
          name="address_line1"
          type="text"
          required
          defaultValue={address?.address_line1 || ""}
          placeholder="123 Main Street"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Address Line 2
        </label>
        <input
          name="address_line2"
          type="text"
          defaultValue={address?.address_line2 || ""}
          placeholder="Apt 4B, Floor 2"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
        />
      </div>

      {/* Default checkbox */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          name="is_default"
          defaultChecked={address?.is_default || false}
          className="w-4.5 h-4.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
        />
        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
          Set as default address
        </span>
      </label>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {isEditing ? "Update Address" : "Save Address"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Address Card ────────────────────────────────────────────

function AddressCard({ address, isSelected, onSelect, onEdit }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAddressAction(address.id);
    if (result?.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Address deleted");
    }
  };

  const handleSetDefault = async () => {
    const result = await setDefaultAddressAction(address.id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Default address updated");
    }
  };

  return (
    <div
      onClick={() => onSelect(address.id)}
      className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-md ${
        isSelected
          ? "border-gray-900 bg-gray-50 shadow-md"
          : "border-gray-100 bg-white hover:border-gray-300"
      } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Default badge */}
      {address.is_default && (
        <div className="absolute -top-2.5 left-4 bg-gray-900 text-white text-xs font-bold px-3 py-0.5 rounded-full">
          Default
        </div>
      )}

      {/* Selection indicator */}
      <div className="absolute top-4 right-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected ? "border-gray-900 bg-gray-900" : "border-gray-300"
          }`}
        >
          {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
        </div>
      </div>

      <div className="pr-8">
        <p className="font-bold text-gray-900 text-base">{address.full_name}</p>
        <p className="text-sm text-gray-500 mt-0.5">{address.phone}</p>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {address.address_line1}
          {address.address_line2 && `, ${address.address_line2}`}
          <br />
          {address.city}
          {address.state && `, ${address.state}`}
          {address.postal_code && ` ${address.postal_code}`}
          <br />
          {address.country}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(address);
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
        {!address.is_default && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSetDefault();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-amber-600 transition-colors px-2 py-1 rounded-lg hover:bg-amber-50"
          >
            <Star className="w-3.5 h-3.5" />
            Set Default
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 ml-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── Main Checkout Client ────────────────────────────────────

export default function CheckoutClient({ addresses, userId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.is_default)?.id || addresses[0]?.id || null,
  );
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update selection when addresses change (e.g. after add/delete)
  useEffect(() => {
    if (
      addresses.length > 0 &&
      !addresses.find((a) => a.id === selectedAddressId)
    ) {
      setSelectedAddressId(
        addresses.find((a) => a.is_default)?.id || addresses[0]?.id,
      );
    }
    if (addresses.length === 0) {
      setSelectedAddressId(null);
    }
  }, [addresses, selectedAddressId]);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const estimatedTax = totalAmount * 0.08;
  const finalTotal = totalAmount + estimatedTax;

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || cartItems.length === 0) return;
    setIsPlacingOrder(true);

    try {
      const res = await createOrderAction(
        selectedAddressId,
        cartItems,
        finalTotal,
      );
      if (res.error) {
        toast.error(res.error);
        setIsPlacingOrder(false);
        return;
      }

      dispatch(storeActions.clearCart());
      toast.success("Order placed successfully! Pending payment.");
      router.push("/account/orders");
      router.refresh(); // Refresh to update server-side nav state
    } catch (err) {
      toast.error("An unexpected error occurred.");
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="w-[95%] max-w-7xl mx-auto py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/cart"
              className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Cart
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Shipping Address
          </h1>
          <p className="text-gray-500 mt-1">
            Choose where you&apos;d like your order delivered
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Addresses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Form (shown when adding/editing) */}
          {showForm && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-gray-900">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={handleCancelForm}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <AddressForm
                address={editingAddress}
                onCancel={handleCancelForm}
              />
            </div>
          )}

          {/* Saved Addresses */}
          {addresses.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  Saved Addresses
                  <span className="text-sm font-normal text-gray-400">
                    ({addresses.length})
                  </span>
                </h2>
                {!showForm && (
                  <button
                    onClick={handleAddNew}
                    className="flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-black transition-colors px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    isSelected={selectedAddressId === addr.id}
                    onSelect={setSelectedAddressId}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </div>
          ) : (
            !showForm && (
              <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-100 rounded-2xl">
                <div className="bg-gray-50 rounded-full p-6 mb-5">
                  <MapPin className="w-12 h-12 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  No Saved Addresses
                </h2>
                <p className="text-gray-500 mb-6 text-center max-w-sm">
                  Add a shipping address to continue with your order.
                </p>
                <button
                  onClick={handleAddNew}
                  className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  Add Address
                </button>
              </div>
            )
          )}
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-5">
              Order Summary
            </h2>

            {/* Cart Items Preview */}
            {cartItems.length > 0 ? (
              <div className="space-y-3 mb-5">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 mb-5">
                <Package className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Your cart is empty</p>
              </div>
            )}

            <hr className="border-gray-100 mb-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal ({totalItems} items)
                </span>
                <span className="font-bold text-gray-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Tax</span>
                <span className="font-bold text-gray-900">
                  ${estimatedTax.toFixed(2)}
                </span>
              </div>
            </div>

            <hr className="my-5 border-gray-100" />

            <div className="flex justify-between mb-6">
              <span className="text-lg font-extrabold text-gray-900">
                Total
              </span>
              <span className="text-lg font-extrabold text-gray-900">
                ${finalTotal.toFixed(2)}
              </span>
            </div>

            {/* Selected address preview */}
            {selectedAddressId && (
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Delivering to
                </p>
                {(() => {
                  const addr = addresses.find(
                    (a) => a.id === selectedAddressId,
                  );
                  if (!addr) return null;
                  return (
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {addr.full_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {addr.address_line1}, {addr.city}, {addr.country}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={
                !selectedAddressId || cartItems.length === 0 || isPlacingOrder
              }
              className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              {isPlacingOrder ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue to Payment"
              )}
            </button>

            {/* Trust Badges */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                <span>Secure SSL checkout</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Truck className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Free shipping on all orders</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <RotateCcw className="w-4 h-4 text-orange-500 shrink-0" />
                <span>30-day easy returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
