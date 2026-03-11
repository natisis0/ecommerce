import { getCurrentUser } from "@/_lib/auth";
import { getOrdersByUserId } from "@/_lib/data-service";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Package, Clock, CheckCircle } from "lucide-react";
import OrderActions from "../../../../components/OrderActions";

export const metadata = {
  title: "My Orders",
  description: "View your order history",
};

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrdersByUserId(user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-900">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-500 max-w-sm">
            You haven&apos;t placed any orders yet. Once you do, they will
            appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <details className="group">
                <summary className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 cursor-pointer hover:bg-gray-100 transition-colors list-none">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Order Placed
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Total
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      ${order.total_price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <div className="flex items-center gap-1.5">
                      {order.status === "pending" ||
                      order.payment_status === "pending" ? (
                        <Clock className="w-4 h-4 text-orange-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <p
                        className={`text-sm font-bold capitalize ${
                          order.status === "pending"
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {order.payment_status === "pending"
                          ? "Pending Payment"
                          : order.status}
                      </p>
                    </div>

                    {/* Pending Actions (Delete / Pay) */}
                    <div className="mt-2 text-left">
                      <OrderActions
                        orderId={order.id}
                        status={order.status}
                        paymentStatus={order.payment_status}
                      />
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex items-center gap-4 col-span-2 sm:col-span-1 sm:justify-end">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Order ID
                      </p>
                      <p className="text-sm font-mono text-gray-900">
                        {order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    {/* The dropdown arrow */}
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex flex-col items-center justify-center text-gray-500 group-open:rotate-180 transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </summary>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        {item.products?.image ? (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                            <Image
                              src={item.products.image}
                              alt={item.products.name || "Product"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gray-50 shrink-0 border border-gray-100 flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-gray-900 truncate">
                            {item.products?.name || "Unknown Product"}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold text-gray-900">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
