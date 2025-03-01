"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ToolCard from "../components/ToolCard";
import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";

interface Review {
  id: string;
  user: string;
  comment: string;
  rating: number;
}

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
  reviews: Review[];
}

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  // ✅ Implement search filtering
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTools(tools);
    } else {
      setFilteredTools(
        tools.filter((tool) =>
          tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.categories.some((category) =>
            category.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    }
  }, [searchTerm, tools]);

  return (
    <div className="container mt-4">
      <h1 className="display-4">AI Tools Wiki</h1>
      <p className="lead">
        Welcome to the AI Tools Wiki! This is a community-driven repository of AI tools.
        Browse by category, search for tools, or add new ones.
      </p>

      {/* ✅ Search Bar for filtering */}
      <SearchBar onSearch={(query: string) => setSearchTerm(query)} />

      {/* ✅ Category Selection (TODO: Implement filtering logic) */}
      <Categories onCategorySelect={() => { /* TODO: Implement category filtering */ }} />

      <div className="text-center my-4">
        <Link href="/add-tool">
          <button className="btn btn-primary btn-lg">Add New AI Tool</button>
        </Link>
      </div>

      <h2 className="h3 mb-4">Recently Added Tools</h2>

      <div className="row">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <div key={tool.id} className="col-md-4 mb-3">
              <ToolCard {...tool} />
            </div>
          ))
        ) : (
          <p className="text-muted">📢 No matching tools found.</p>
        )}
      </div>
    </div>
  );
}
