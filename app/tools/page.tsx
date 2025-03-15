"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ToolCard from "@/components/ToolCard";
import CategoryButtons from "@/components/CategoryButtons";
import { Form, Button } from "react-bootstrap";

interface Tool {
  toolId: string;
  name: string;
  description: string;
  categories?: string[];
  pricing?: string;
  website?: string;
  submittedBy?: string;
  dateSubmitted?: string;
  thumbnail?: string;
  reviews?: {
    id: string;
    user: string;
    comment: string;
    rating: number;
  }[];
  showReviewForm?: boolean;
}

export default function ToolsPage() {
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>("name-asc");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchTools = async () => {
      try {
        console.log("📡 Fetching tools...");
        const response = await fetch("/api/getTools");

        if (!response.ok) {
          throw new Error(`Failed to fetch tools. Status: ${response.status}`);
        }

        let data: Tool[] = await response.json();

        const toolsWithReviews = await Promise.all(
          data.map(async (tool) => {
            try {
              const reviewsResponse = await fetch(`/api/getReviews?toolId=${tool.toolId}`);
              const reviews = reviewsResponse.ok ? await reviewsResponse.json() : [];
              return { ...tool, reviews };
            } catch (error) {
              return { ...tool, reviews: [] };
            }
          })
        );

        setTools(toolsWithReviews);
        setFilteredTools(toolsWithReviews);
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
      setTools((prevTools) => prevTools.filter((tool) => tool.toolId !== toolId));
      setFilteredTools((prevFilteredTools) => prevFilteredTools.filter((tool) => tool.toolId !== toolId));
    } catch (error) {
      console.error("❌ Error deleting tool:", error);
    }
  };

  const handleSubmitReview = async (toolId: string) => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide a rating and a comment.");
      return;
    }

    const newReview = {
      id: `review-${Date.now()}`,
      toolId,
      user: "guest",
      comment,
      rating,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/addReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      const reviewsResponse = await fetch(`/api/getReviews?toolId=${toolId}`);
      const updatedReviews = reviewsResponse.ok ? await reviewsResponse.json() : [];

      setTools((prevTools) =>
        prevTools.map((tool) =>
          tool.toolId === toolId ? { ...tool, reviews: updatedReviews, showReviewForm: false } : tool
        )
      );

      setFilteredTools((prevTools) =>
        prevTools.map((tool) =>
          tool.toolId === toolId ? { ...tool, reviews: updatedReviews, showReviewForm: false } : tool
        )
      );

      setRating(0);
      setComment("");
    } catch (error) {
      console.error("❌ Error submitting review:", error);
    }
  };

  const sortTools = (option: string) => {
    let sortedTools = [...filteredTools];

    switch (option) {
      case "name-asc":
        sortedTools.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedTools.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "category":
        sortedTools.sort((a, b) => (a.categories?.[0] || "").localeCompare(b.categories?.[0] || ""));
        break;
      case "rating":
        sortedTools.sort((a, b) => {
          const ratingA = a.reviews && a.reviews.length > 0
            ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length
            : 0;
          const ratingB = b.reviews && b.reviews.length > 0
            ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
            : 0;

          return ratingB - ratingA;
        });
        break;
      default:
        break;
    }

    setFilteredTools(sortedTools);
    setSortOption(option);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Browse AI Tools</h1>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search AI Tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      <CategoryButtons onCategorySelect={() => {}} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Select value={sortOption} onChange={(e) => sortTools(e.target.value)}>
          <option value="name-asc">Sort by Name (A-Z)</option>
          <option value="name-desc">Sort by Name (Z-A)</option>
          <option value="category">Sort by Category</option>
          <option value="rating">Sort by Rating (High to Low)</option>
        </Form.Select>

        <Button variant="secondary" onClick={() => setViewMode(viewMode === "card" ? "list" : "card")}>
          {viewMode === "card" ? "🔄 Switch to List View" : "🔄 Switch to Card View"}
        </Button>
      </div>

      {loading ? (
        <p>Loading tools...</p>
      ) : filteredTools.length === 0 ? (
        <p>No tools found.</p>
      ) : (
        <div className={viewMode === "card" ? "row" : ""}>
          {filteredTools.map((tool) => (
            <div key={tool.toolId} className={viewMode === "card" ? "col-md-4 mb-4" : "mb-3"}>
              <ToolCard {...tool} onDelete={() => handleDelete(tool.toolId)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
