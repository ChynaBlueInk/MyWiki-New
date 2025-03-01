"use client";

import { useState, useEffect } from "react";
import ToolCard from "../../components/ToolCard";
import Categories from "../../components/Categories";

interface Tool {
  id: string;
  name: string;
  description: string;
  categories: string[];
  pricing: string;
  website: string;
  thumbnail: string;
  submittedBy: string;
  dateSubmitted: string;
  averageRating: number;
  reviews: { id: string; user: string; comment: string; rating: number }[];
}

export default function CategoriesPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // ✅ Replace Firestore fetching with placeholder data
  useEffect(() => {
    const sampleTools: Tool[] = [
      {
        id: "1",
        name: "ChatGPT",
        description: "AI chatbot by OpenAI",
        categories: ["Writing", "Chatbot"],
        pricing: "Free",
        website: "https://openai.com/chatgpt",
        thumbnail: "/placeholder.svg",
        submittedBy: "John Doe",
        dateSubmitted: "2025-03-01",
        averageRating: 4.5,
        reviews: [
          { id: "r1", user: "Alice", comment: "Amazing chatbot!", rating: 5 },
          { id: "r2", user: "Bob", comment: "Very useful for work.", rating: 4 },
        ],
      },
      {
        id: "2",
        name: "DALL·E",
        description: "AI image generation",
        categories: ["Images", "Art"],
        pricing: "Paid",
        website: "https://openai.com/dalle",
        thumbnail: "/placeholder.svg",
        submittedBy: "Jane Smith",
        dateSubmitted: "2025-03-01",
        averageRating: 4.0,
        reviews: [
          { id: "r3", user: "Charlie", comment: "Creates beautiful images!", rating: 4 },
          { id: "r4", user: "David", comment: "Could be more detailed.", rating: 3 },
        ],
      },
    ];
    setTools(sampleTools);
    setFilteredTools(sampleTools);
  }, []);

  // ✅ Filter tools based on selected category
  useEffect(() => {
    if (selectedCategory === "") {
      setFilteredTools(tools);
    } else {
      setFilteredTools(
        tools.filter((tool) => tool.categories.includes(selectedCategory))
      );
    }
  }, [selectedCategory, tools]);

  return (
    <div className="container mt-4">
      <h1 className="display-4">AI Tool Categories</h1>
      <p className="lead">
        Select a category to view relevant AI tools.
      </p>

      {/* ✅ Category Selection */}
      <Categories onCategorySelect={setSelectedCategory} />

      <div className="row mt-3">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <div key={tool.id} className="col-md-4 mb-3">
              <ToolCard {...tool} />
            </div>
          ))
        ) : (
          <p className="text-muted">No tools found for this category.</p>
        )}
      </div>
    </div>
  );
}
