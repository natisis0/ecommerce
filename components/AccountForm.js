"use client";

import React, { useActionState, useEffect, useState, useRef } from "react";
import { updateProfileAction } from "@/_lib/account-action";
import { signOut } from "@/_lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, LogOut, Save, User } from "lucide-react";

const AccountForm = ({ user, profile }) => {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    {},
  );
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(
    profile?.avatar_url || user?.user_metadata?.avatar_url || null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Profile updated successfully!");
      router.refresh();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.fullName ||
    user?.user_metadata?.full_name ||
    "";
  const email = user?.email || "";

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Avatar & Info */}
        <div className="px-4 sm:px-8 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
            {/* Avatar */}
            <button
              type="button"
              onClick={handleAvatarClick}
              className="relative group cursor-pointer shrink-0"
            >
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-100 to-purple-100">
                    <User className="w-12 h-12 text-indigo-400" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>

            {/* User Basic Info */}
            <div className="text-center sm:text-left pb-1">
              <h2 className="text-xl font-bold text-gray-900">
                {displayName || "Set your name"}
              </h2>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form action={formAction}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Edit Profile
          </h3>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            name="avatar"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="full_name"
                type="text"
                name="full_name"
                defaultValue={displayName}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Role */}
            {profile?.role && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Role
                </label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 capitalize">
                  {profile.role}
                </span>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      {/* Sign Out */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Out</h3>
        <p className="text-sm text-gray-500 mb-4">
          Sign out of your account on this device.
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AccountForm;
