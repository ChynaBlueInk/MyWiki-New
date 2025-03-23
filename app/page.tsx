"use client";

import { useState, useEffect } from "react";
import ToolCard from "../components/ToolCard";
import CategoryButtons from "../components/CategoryButtons";
import { Button, Form, Alert } from "react-bootstrap";

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
  createdAt?: string;
  thumbnail?: string;
  averageRating?: number;
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
        const response = await fetch("/api/getTools");

        if (!response.ok) {
          throw new Error(`Failed to fetch tools. Status: ${response.status}`);
        }

        let data: Tool[] = await response.json();
        const normalizedTools = data.map((tool) => ({
          ...tool,
          categories: tool.categories ?? (tool.category ? [tool.category] : []),
        }));

        const sortedTools = normalizedTools.sort((a, b) => {
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
        });

        setTools(sortedTools);
        setFilteredTools(sortedTools.slice(0, 4));
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
      const response = await fetch(`/api/deleteTool?toolId=${toolId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tool");
      }

      console.log("✅ Tool deleted successfully");
      setTools((prev) => prev.filter((tool) => tool.toolId !== toolId));
      setFilteredTools((prev) => prev.filter((tool) => tool.toolId !== toolId));
    } catch (error) {
      console.error("❌ Error deleting tool:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Welcome to AI Tools Wiki</h1>
      <p className="mb-3">
        Explore our community-driven collection of AI tools. You can search by name or category,
        and on the Tools page you can sort the tools using the dropdown, or switch between list and card views. Review tools that you
        have used to help others decide which to explore. Click the <strong>Add Tool</strong> button below
        or use the navigation link to share your own discoveries.
      </p>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search AI Tools..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim() === "") {
              setFilteredTools(tools.slice(0, 4));
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

      <CategoryButtons onCategorySelect={(category) => {
        if (category) {
          setFilteredTools(tools.filter((tool) => tool.categories?.includes(category)));
        } else {
          setFilteredTools(tools.slice(0, 4));
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
              <ToolCard {...tool} onDelete={() => handleDelete(tool.toolId)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
