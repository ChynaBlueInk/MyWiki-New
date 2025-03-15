"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css"; // Import default styles

export default function SignUpPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}>
      <Authenticator signUpAttributes={["email", "name"]} />
    </div>
  );
}
