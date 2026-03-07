"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package } from "lucide-react";

export default function AccountSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/account", label: "Profile Details", icon: User },
    { href: "/account/orders", label: "My Orders", icon: Package },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm sticky top-8">
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-gray-300" : "text-gray-400"}`}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
