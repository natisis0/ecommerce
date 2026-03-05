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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        <AccountForm user={user} profile={profile} />
      </div>
    </div>
  );
}
