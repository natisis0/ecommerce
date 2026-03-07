import { getCurrentUser } from "@/_lib/auth";
import { getAddresses } from "@/_lib/data-service";
import { redirect } from "next/navigation";
import CheckoutClient from "../../../components/CheckoutClient";

export const metadata = {
  title: "Checkout — Shipping Address",
  description: "Select or add a shipping address for your order",
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const addresses = await getAddresses(user.id);

  return <CheckoutClient addresses={addresses} userId={user.id} />;
}
