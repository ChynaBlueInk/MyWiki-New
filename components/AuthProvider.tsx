"use client";

import { AuthProvider, useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";

const cognitoAuthConfig = {
    authority: "https://ap-southeast-226xbcjc5b.auth.ap-southeast-2.amazoncognito.com",
    client_id: "2h33kmsdanqgircme7l14d1d0j",
  redirect_uri: "http://localhost:3000/auth",
  response_type: "code",
  scope: "email openid phone",
};

export default function MyAuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}

// Custom hook to manage authentication state
export function usePersistentAuth() {
  const auth = useAuth();
  const [user, setUser] = useState(() => {
    // Load user session from localStorage when the app starts
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("auth_user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      localStorage.setItem("auth_user", JSON.stringify(auth.user));
    } else if (!auth.isAuthenticated) {
      localStorage.removeItem("auth_user");
    }
  }, [auth.isAuthenticated, auth.user]);

  return { auth, user };
}
