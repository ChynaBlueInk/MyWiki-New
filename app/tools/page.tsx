"use client";

import { useState, useEffect } from "react";
import ToolCard from "../../components/ToolCard";
import CategoryButtons from "../../components/CategoryButtons";
import SearchBar from "../../components/SearchBar";

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
  dateSubmitted?: string;  // ✅ Ensure dateSubmitted is included
  createdAt?: string;      // ✅ Ensure createdAt is included
  thumbnail?: string;
  averageRating?: number;
  reviews?: Review[];
};

// Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("latest"); // ✅ Default sorting by newest first

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

        // ✅ Normalize categories
        const normalizedTools = data.map((tool) => ({
          ...tool,
          categories: tool.categories ?? (tool.category ? [tool.category] : []),
        }));

        setTools(normalizedTools);
        setFilteredTools(normalizedTools); // ✅ Default to showing all tools
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching tools:", error);
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  // ✅ Filter tools based on search & category selection
  useEffect(() => {
    let updatedTools = [...tools];

    if (searchTerm) {
      updatedTools = updatedTools.filter((tool) =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      updatedTools = updatedTools.filter((tool) => tool.categories?.includes(selectedCategory));
    }

    // ✅ Sorting Logic
    if (sortBy === "latest") {
      updatedTools.sort((a, b) => 
        new Date(b.dateSubmitted ?? b.createdAt ?? 0).getTime() - 
        new Date(a.dateSubmitted ?? a.createdAt ?? 0).getTime()
      );
    } else if (sortBy === "name-asc") {
      updatedTools.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      updatedTools.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "rating-high") {
      updatedTools.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
    } else if (sortBy === "rating-low") {
      updatedTools.sort((a, b) => (a.averageRating ?? 0) - (b.averageRating ?? 0));
    }

    setFilteredTools(updatedTools);
  }, [searchTerm, selectedCategory, sortBy, tools]);

  return (
    <div className="container mt-4">
      <h1>AI Tools</h1>
      <p>Explore the latest AI tools.</p>

      {/* ✅ Search Bar */}
      <SearchBar onSearch={(query) => setSearchTerm(query)} />


      {/* ✅ Category Buttons */}
      <CategoryButtons onCategorySelect={setSelectedCategory} />

      {/* ✅ Sorting Dropdown */}
      <div className="mb-3">
        <label className="form-label">Sort by:</label>
        <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="latest">Latest Added</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="rating-high">Highest Rated</option>
          <option value="rating-low">Lowest Rated</option>
        </select>
      </div>

      {loading ? (
        <p>Loading tools...</p>
      ) : filteredTools.length === 0 ? (
        <p>No tools found.</p>
      ) : (
        <div className="row">
          {filteredTools.map((tool) => (
            <div key={tool.toolId} className="col-md-6">
              <ToolCard {...tool} onDelete={() => {}} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
