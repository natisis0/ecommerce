import { getCurrentUser } from "@/_lib/auth";
import { getProfile } from "@/_lib/data-service";
import { redirect } from "next/navigation";
import AccountForm from "../../../components/AccountForm";

export const metadata = {
  title: "My Account",
  description: "Manage your account settings and profile",
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(user.id);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        Profile Details
      </h1>
      <AccountForm user={user} profile={profile} />
    </div>
  );
}
