"use client";

import AddTool from "../../components/AddTool";
import { useRouter } from "next/navigation";

export default function AddToolPage() {
  const router = useRouter();

  const handleToolAdded = (toolId: string) => {
    router.push(`/tool/${toolId}?submitted=true`);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Add a New Tool</h2>
      <div className="card shadow p-4">
        <AddTool onToolAdded={handleToolAdded} />
      </div>
    </div>
  );
}