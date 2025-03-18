import type { Metadata } from "next";
// import "@/lib/awsConfig"; // Temporary removal
import "../styles/global.css";  
import "bootstrap/dist/css/bootstrap.min.css";  
import NavBar from "../components/NavBar";
import MyAuthProvider from "../components/AuthProvider"; // Ensure this is correctly imported
import "@aws-amplify/ui-react/styles.css"; // Import Amplify UI styles

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
        <MyAuthProvider>  {/* Wrap the app in the correct Client Component */}
          <NavBar />  
          <main>{children}</main> {/* ✅ Wrap content inside <main> */}
        </MyAuthProvider>
      </body>
    </html>
  );
}
