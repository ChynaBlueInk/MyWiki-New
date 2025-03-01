import type { Metadata } from "next";
import "../styles/navbar.css";  // Import NavBar styles
import NavBar from "../components/NavBar";
import "../styles/global.css";  // ✅ Import the correct global.css file
import "bootstrap/dist/css/bootstrap.min.css";  // ✅ Keep Bootstrap import

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />  {/* Insert the NavBar at the top */}
        {children}
      </body>
    </html>
  );
}
