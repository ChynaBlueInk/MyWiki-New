"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";

const categoryOptions = ["Writing", "Video", "Music", "Images", "All-Round"];

export default function EditToolPage() {
  const router = useRouter();
  const { id } = useParams();

  const [toolData, setToolData] = useState({
    name: "",
    description: "",
    categories: [] as string[],
    pricing: "",
    website: "",
    thumbnail: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      console.error("❌ No ID provided!");
      setLoading(false);
      return;
    }

    // ✅ Placeholder Data (until database is connected)
    const sampleTools = [
      {
        id: "1",
        name: "ChatGPT",
        description: "AI chatbot by OpenAI",
        categories: ["Writing", "Chatbot"],
        pricing: "Free",
        website: "https://openai.com/chatgpt",
        thumbnail: "/placeholder.svg",
      },
      {
        id: "2",
        name: "DALL·E",
        description: "AI image generation",
        categories: ["Images", "Art"],
        pricing: "Paid",
        website: "https://openai.com/dalle",
        thumbnail: "/placeholder.svg",
      },
    ];

    const selectedTool = sampleTools.find((tool) => tool.id === id);
    if (selectedTool) {
      setToolData(selectedTool);
    } else {
      console.error("❌ Tool not found!");
    }
    setLoading(false);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setToolData({ ...toolData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (category: string) => {
    setToolData((prevData) => ({
      ...prevData,
      categories: prevData.categories.includes(category)
        ? prevData.categories.filter((c) => c !== category)
        : [...prevData.categories, category],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("✅ Updated Tool Data:", toolData);
    setMessage("✅ Tool successfully updated!");
    setTimeout(() => router.push(`/tool/${id}`), 2000);
  };

  if (loading) return <p className="text-center mt-5 text-muted">📢 Loading tool details...</p>;

  return (
    <div className="container mt-4">
      <Button variant="secondary" onClick={() => router.back()} className="mb-3">
        ← Back
      </Button>

      <h1 className="h3 mb-4">Edit {toolData.name}</h1>

      {message && <p className="alert alert-success">{message}</p>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tool Name</Form.Label>
          <Form.Control type="text" name="name" value={toolData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" value={toolData.description} onChange={handleChange} required />
        </Form.Group>

        {/* ✅ Category Selection */}
        <Form.Group className="mb-3">
          <Form.Label>Select Categories:</Form.Label>
          {categoryOptions.map((category) => (
            <Form.Check
              key={category}
              type="checkbox"
              label={category}
              checked={toolData.categories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
          ))}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Pricing</Form.Label>
          <Form.Control type="text" name="pricing" value={toolData.pricing} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website URL</Form.Label>
          <Form.Control type="url" name="website" value={toolData.website} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thumbnail URL</Form.Label>
          <Form.Control type="text" name="thumbnail" value={toolData.thumbnail} onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </div>
  );
}
