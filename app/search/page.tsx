"use client";

import { useState, useEffect } from "react";
import ToolCard from "../../components/ToolCard";
import CategoryButtons from "../../components/CategoryButtons";
import { Form } from "react-bootstrap";

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
  category?: string; // ✅ Some tools may have `category`
  pricing?: string;
  website?: string;
  submittedBy?: string;
  dateSubmitted?: string;
  thumbnail?: string;
  averageRating?: number;
  reviews?: Review[];
};

export default function SearchPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        console.log("📡 Fetching tools from AWS DynamoDB...");
        const response = await fetch("/api/getTools"); // ✅ Uses relative path for correct port

        if (!response.ok) {
          throw new Error(`Failed to fetch tools. Status: ${response.status}`);
        }

        let data: Tool[] = await response.json();
        console.log("✅ Tools retrieved:", data);

        // ✅ Normalize categories: Ensure all tools have `categories` as an array
        const normalizedTools = data.map((tool) => ({
          ...tool,
          categories: tool.categories ?? (tool.category ? [tool.category] : []), // ✅ Convert `category` to `categories`
        }));

        setTools(normalizedTools);
        setFilteredTools(normalizedTools);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching tools:", error);
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleCategorySelect = (category: string | null) => {
    if (category) {
      setFilteredTools(tools.filter((tool) => tool.categories?.includes(category)));
    } else {
      setFilteredTools(tools);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setFilteredTools(tools);
    } else {
      setFilteredTools(
        tools.filter((tool) =>
          tool.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          tool.description.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="container mt-4">
      <h1>Search AI Tools</h1>

      {/* ✅ Category Buttons */}
      <CategoryButtons onCategorySelect={handleCategorySelect} />

      {/* ✅ Search Bar */}
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search AI Tools..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Form>

      {loading ? (
        <p>Loading...</p>
      ) : filteredTools.length === 0 ? (
        <p>No tools found.</p>
      ) : (
        <div className="row">
          {filteredTools.map((tool) => (
            <div key={tool.toolId} className="col-md-6">
              <ToolCard {...tool} onDelete={() => {}} /> {/* ✅ Add empty onDelete function */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
