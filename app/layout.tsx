import type { Metadata } from "next";
// import "@/lib/awsConfig"; // Temporary removal
import "../styles/navbar.css";  
import "../styles/global.css";  
import "bootstrap/dist/css/bootstrap.min.css";  
import NavBar from "../components/NavBar";
import MyAuthProvider from "../components/AuthProvider"; // Ensure this is correctly imported
import "@aws-amplify/ui-react/styles.css"; // Import Amplify UI styles

export const metadata: Metadata = {
  title: "MyWiki",
  description: "An AI Tools Wiki",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MyAuthProvider>  {/* Wrap the app in the correct Client Component */}
          <NavBar />  
          {children}
        </MyAuthProvider>
      </body>
    </html>
  );
}
