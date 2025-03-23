import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer"; // ✅ Import Footer
import MyAuthProvider from "../components/AuthProvider";
import "@aws-amplify/ui-react/styles.css";

export const metadata: Metadata = {
  title: "AI Tools Wiki",
  description: "A community-driven AI Tools repository",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body>
        <MyAuthProvider>
          <NavBar />
          <main>{children}</main>
          <Footer /> {/* ✅ Add Footer below main content */}
        </MyAuthProvider>
      </body>
    </html>
  );
}
