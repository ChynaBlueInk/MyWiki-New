"use client";

import { useState } from "react";
import AddTool from "../../components/AddTool";

export default function AddToolPage() {
  return (
    <div className="container mt-4">
      <h1>Add a New Tool</h1>
      <AddTool />
    </div>
  );
}
