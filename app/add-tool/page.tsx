"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, AuthUser } from "@aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function AddToolPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null); // 👈 Fix Type Issue
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser as AuthUser); // 👈 Ensure Type Safety
      } catch (error) {
// if (!user) {
//   return <Login />;
// }
} finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Add a New Tool</h2>
      {/* Your Add Tool Form */}
    </div>
  );
}
