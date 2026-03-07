import AccountSidebar from "../../../components/AccountSidebar";

export default function AccountLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-[95%] max-w-7xl mx-auto py-8 md:py-12 flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
