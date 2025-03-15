"use client";

import { useState, useEffect } from "react";
import ToolCard from "../components/ToolCard";
import CategoryButtons from "../components/CategoryButtons";
import { Button, Form } from "react-bootstrap";

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
  createdAt?: string;
  reviews?: Review[];
};

export default function HomePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        console.log("📡 Fetching tools from AWS DynamoDB...");
        const response = await fetch("/api/getTools"); // ✅ Uses correct API path

        if (!response.ok) {
          throw new Error(`Failed to fetch tools. Status: ${response.status}`);
        }

        let data: Tool[] = await response.json();
        console.log("✅ Tools retrieved:", data);

        // Normalize categories: Ensure `categories` is always an array
        const normalizedTools = data.map((tool) => ({
          ...tool,
          categories: tool.categories ?? (tool.category ? [tool.category] : []),
        }));

        // Sort tools by `createdAt` (most recent first)
        const sortedTools = normalizedTools.sort((a, b) => {
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
        });

        setTools(sortedTools);
        setFilteredTools(sortedTools.slice(0, 4)); // Show only 4 recent tools on homepage
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching tools:", error);
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleDelete = async (toolId: string) => {
    if (!window.confirm("Are you sure you want to delete this tool?")) return;

    try {
      console.log(`🗑️ Deleting tool: ${toolId}`);
      const response = await fetch(`/api/deleteTool?toolId=${toolId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tool");
      }

      console.log("✅ Tool deleted successfully");

      // ✅ Remove deleted tool from UI instantly
      setTools((prevTools) => prevTools.filter((tool) => tool.toolId !== toolId));
      setFilteredTools((prevFilteredTools) => prevFilteredTools.filter((tool) => tool.toolId !== toolId));
    } catch (error) {
      console.error("❌ Error deleting tool:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Welcome to AI Tools Wiki</h1>
      <p>This is a community-driven repository of AI tools. Browse by category or add new ones.</p>

      {/* ✅ Search Input */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search AI Tools..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim() === "") {
              setFilteredTools(tools.slice(0, 4)); // ✅ Reset to 4 most recent tools when search is cleared
            } else {
              setFilteredTools(
                tools.filter((tool) =>
                  tool.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                  tool.description.toLowerCase().includes(e.target.value.toLowerCase())
                )
              );
            }
          }}
        />
      </Form.Group>

      {/* ✅ Category Filter Bar */}
      <CategoryButtons onCategorySelect={(category) => {
        if (category) {
          setFilteredTools(tools.filter((tool) => tool.categories?.includes(category)));
        } else {
          setFilteredTools(tools.slice(0, 4)); // ✅ Reset to 4 most recent tools when no category is selected
        }
      }} />

      <Button variant="success" href="/add-tool" className="mb-4">
        ➕ Add New AI Tool
      </Button>

      <h2>Recently Added Tools</h2>
      {loading ? (
        <p>Loading tools...</p>
      ) : filteredTools.length === 0 ? (
        <p>No tools found.</p>
      ) : (
        <div className="row">
          {filteredTools.map((tool) => (
            <div key={tool.toolId} className="col-md-6">
              <ToolCard {...tool} onDelete={() => handleDelete(tool.toolId)} /> {/* ✅ Fix: Pass delete function */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
