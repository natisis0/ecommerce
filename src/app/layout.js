
import Footers from "../../components/Footer";
import Navbar from "../../components/NavBar/Navbar";
import "./globals.css";

export const metadata = {
  title: "Ecommerce",
  description: "Ecommerce website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        
        <Footers/>
      </body>
    </html>
  );
}
