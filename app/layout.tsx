import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";  // ✅ Import Bootstrap first
import "../styles/global.css";                    // ✅ Import custom styles second
import NavBar from "../components/NavBar";
import MyAuthProvider from "../components/AuthProvider";
import "@aws-amplify/ui-react/styles.css"; // Amplify UI styles

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
        {/* ✅ Add Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body>
        <MyAuthProvider>
          <NavBar />
          <main>{children}</main>
        </MyAuthProvider>
      </body>
    </html>
  );
}
