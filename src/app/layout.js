import Footers from "../../components/Footer";
import Navbar from "../../components/NavBar/Navbar";
import "./globals.css";
import Providers from "./Providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Ecommerce",
  description: "Ecommerce website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footers />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
