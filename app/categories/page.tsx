"use client";

import { useState, useEffect } from "react";
import ToolCard from "../../components/ToolCard";
import CategoryButtons from "../../components/CategoryButtons";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function CategoriesPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // ✅ Added view toggle state

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
      setFilteredTools(normalizedTools);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching tools:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleCategorySelect = (category: string | null) => {
    if (category) {
      setFilteredTools(tools.filter((tool) => tool.categories?.includes(category)));
    } else {
      setFilteredTools(tools);
    }
  };

  // ✅ Function to toggle between grid and list view
  const toggleView = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  return (
    <div className="container mt-4">
      <h1>AI Tool Categories</h1>
      <p>Select a category to view relevant AI tools.</p>

      <CategoryButtons onCategorySelect={handleCategorySelect} />

      {/* ✅ View toggle button */}
      <button className="btn btn-secondary mb-3" onClick={toggleView}>
        {viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"}
      </button>

      {loading ? (
        <p>Loading tools...</p>
      ) : filteredTools.length === 0 ? (
        <p>No tools found for this category.</p>
      ) : viewMode === "grid" ? (
        <div className="row">
          {filteredTools.map((tool) => (
            <div key={tool.toolId} className="col-md-6">
              <ToolCard {...tool} onDelete={() => {}} />
            </div>
          ))}
        </div>
      ) : (
        <ul className="list-group">
          {filteredTools.map((tool) => (
            <li key={tool.toolId} className="list-group-item">
              {tool.name} - {tool.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
