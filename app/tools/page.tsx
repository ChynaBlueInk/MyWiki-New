"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ToolCard from "../../components/ToolCard";
import CategoryButtons from "../../components/CategoryButtons";
import SearchBar from "../../components/SearchBar";
import { Button } from "react-bootstrap";

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

function ToolsContent() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch("/api/getTools");

        if (!response.ok) {
          throw new Error(`Failed to fetch tools. Status: ${response.status}`);
        }

        let data: Tool[] = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          setError("No tools found. Try adding one!");
          setLoading(false);
          return;
        }

        const normalizedTools = data.map((tool) => ({
          ...tool,
          categories: tool.categories ?? (tool.category ? [tool.category] : []),
          averageRating: typeof tool.averageRating === "number" ? tool.averageRating : 0,
        }));

        setTools(normalizedTools);
        setLoading(false);

        if (!selectedCategory && urlCategory) {
          setSelectedCategory(urlCategory);
        }
      } catch (error) {
        console.error("❌ Error fetching tools:", error);
        setError("Failed to load tools. Please check console logs.");
        setLoading(false);
      }
    };

    fetchTools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let updatedTools = [...tools];

    if (searchTerm) {
      updatedTools = updatedTools.filter((tool) =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const categoryToFilter = selectedCategory || urlCategory;

    if (categoryToFilter) {
      updatedTools = updatedTools.filter((tool) =>
        tool.categories?.includes(categoryToFilter)
      );
    }

    switch (sortBy) {
      case "name-asc":
        updatedTools.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        updatedTools.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating-high":
        updatedTools.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "rating-low":
        updatedTools.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));
        break;
      case "latest":
      default:
        updatedTools.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.dateSubmitted || 0).getTime();
          const dateB = new Date(b.createdAt || b.dateSubmitted || 0).getTime();
          return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
        });
        break;
    }

    setFilteredTools(updatedTools);
  }, [searchTerm, selectedCategory, sortBy, tools, urlCategory]);

  const handleDelete = async (toolId: string) => {
    if (!window.confirm("Are you sure you want to delete this tool?")) return;

    try {
      const response = await fetch(`/api/deleteTool?toolId=${toolId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tool");
      }

      setTools((prev) => prev.filter((tool) => tool.toolId !== toolId));
      setFilteredTools((prev) => prev.filter((tool) => tool.toolId !== toolId));
    } catch (error) {
      console.error("❌ Error deleting tool:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>AI Tools</h1>
      <p>
        Welcome to the AI Tools Wiki — a growing, community-curated collection of helpful AI tools.
        Use the search bar to find tools by name or keyword. You can filter tools by category,
        sort them by name, rating, or newest added, and toggle between card and list views to suit your preference.
        If you've used a tool, consider leaving a review to help others. To contribute a new tool, click
        "Add Tool" on the homepage or in the navigation menu.
      </p>

      {error && <p className="alert alert-danger">{error}</p>}

      <SearchBar onSearch={(query) => setSearchTerm(query)} />
      <CategoryButtons onCategorySelect={(category) => setSelectedCategory(category)} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div style={{ flex: 1 }}>
          <label className="form-label">Sort by:</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest Added</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="rating-high">Highest Rated</option>
            <option value="rating-low">Lowest Rated</option>
          </select>
        </div>

        <div className="ms-3">
          <Button
            variant={viewMode === "card" ? "primary" : "outline-primary"}
            onClick={() => setViewMode("card")}
            className="me-2"
          >
            🧩 Card View
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "outline-primary"}
            onClick={() => setViewMode("list")}
          >
            📋 List View
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading tools...</p>
      ) : filteredTools.length === 0 ? (
        <p className="alert alert-warning">
          🚨 No tools found! Try searching or selecting a different category.
        </p>
      ) : viewMode === "card" ? (
        <div className="row">
          {filteredTools.map((tool) => (
            <div key={tool.toolId} className="col-md-6">
              <ToolCard {...tool} onDelete={() => handleDelete(tool.toolId)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="list-group">
          {filteredTools.map((tool) => (
            <div key={tool.toolId} className="list-group-item py-3">
              <h5>{tool.name}</h5>
              <p className="text-muted">{tool.categories?.join(", ")}</p>
              <p>{tool.description}</p>
              <a href={`/tool/${tool.toolId}`} className="btn btn-sm btn-outline-primary">
                View Details
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ✅ Export wrapped in Suspense
export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="container mt-4">Loading tools...</div>}>
      <ToolsContent />
    </Suspense>
  );
}
