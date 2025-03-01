"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ToolCard from "../../../components/ToolCard";

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

export default function ToolDetailPage() {
  const { id } = useParams();
  const [tool, setTool] = useState<Tool | null>(null);

  useEffect(() => {
    // ✅ Placeholder data instead of Firestore
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

    const selectedTool = sampleTools.find((tool) => tool.id === id) || null;
    setTool(selectedTool);
  }, [id]);

  if (!tool) {
    return <p className="text-center mt-5 text-muted">Tool not found.</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="display-4">{tool.name}</h1>
      <p className="lead">{tool.description}</p>
      <ToolCard {...tool} />
    </div>
  );
}
