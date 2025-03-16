"use client";

import { useState } from "react";
import AddTool from "../../components/AddTool";
import { useRouter } from "next/navigation";

export default function AddToolPage() {
  const router = useRouter();

  return (
    <div className="container mt-4">
      <h2 className="text-center">Add a New Tool</h2>
      <div className="card p-4 shadow-lg">
        <AddTool />
      </div>
    </div>
  );
}
