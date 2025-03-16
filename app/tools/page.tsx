"use client";

import { useState, useEffect } from "react";
import ToolCard from "../../components/ToolCard";

// Define types
type Review = {
  id: string;
  user: string;
  comment: string;
  rating: number;
};

type Tool = {
  toolId: string;
  name: string;
  description: string;
  categories?: string[];
  category?: string;
  pricing?: string;
  website?: string;
  submittedBy?: string;
  dateSubmitted?: string;
  thumbnail?: string;
  averageRating?: number;
  reviews?: Review[];
};

// Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        console.log("📡 Fetching tools from AWS DynamoDB...");

        const response = await fetch(`${API_URL}/api/getTools`);

        if (!response.ok) {
          throw new Error(`Failed to fetch tools. Status: ${response.status}`);
        }

        let data: Tool[] = await response.json();
        console.log("✅ Tools retrieved:", data);

        // Normalize categories
        const normalizedTools = data.map((tool) => ({
          ...tool,
          categories: tool.categories ?? (tool.category ? [tool.category] : []),
        }));

        setTools(normalizedTools);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching tools:", error);
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  return (
    <div className="container mt-4">
      <h1>AI Tools</h1>
      <p>Explore the latest AI tools.</p>

      {loading ? (
        <p>Loading tools...</p>
      ) : tools.length === 0 ? (
        <p>No tools found.</p>
      ) : (
        <div className="row">
          {tools.map((tool) => (
            <div key={tool.toolId} className="col-md-6">
              <ToolCard {...tool} onDelete={() => {}} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
