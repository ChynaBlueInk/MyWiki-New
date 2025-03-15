"use client";

import { useAuth } from "react-oidc-context";
import { usePersistentAuth } from "@/components/AuthProvider"; // Ensure this matches your project structure

export default function AuthPage() {
  const { auth, user } = usePersistentAuth();

  const signOutRedirect = () => {
    const clientId = "2h33kmsdanqgircme7l14d1d0j";
    const logoutUri = "http://localhost:3000/";
    const cognitoDomain = "https://ap-southeast-2_26XbCjC5b.auth.ap-southeast-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  if (auth.isAuthenticated || user) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h2>Welcome, {user?.profile.email || auth.user?.profile.email}</h2>
        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Sign in to MyWiki</h2>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={signOutRedirect}>Sign out</button>
    </div>
  );
}
