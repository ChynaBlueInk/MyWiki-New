"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";

export default function EditToolPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [toolData, setToolData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState<string>("");

  const defaultCategories: string[] = ["Writing", "Video", "Music", "Images", "All-Round"];

  useEffect(() => {
    const fetchTool = async () => {
      try {
        console.log(`📡 Fetching tool details for ID: ${id}`);
        const response = await fetch(`/api/getTool?id=${id}`); // ✅ FIX: Use relative API path

        if (!response.ok) {
          throw new Error("Failed to fetch tool details");
        }

        const data = await response.json();
        console.log("✅ Tool data loaded:", data);

        setToolData({
          ...data,
          categories: Array.isArray(data.categories) ? data.categories : [],
        });
      } catch (error) {
        console.error("❌ Error fetching tool:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [id]);

  const handleCategoryChange = (category: string) => {
    setToolData((prev: any) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c: string) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(e.target.value);
  };

  const handleAddNewCategory = () => {
    if (customCategory.trim() && !toolData.categories.includes(customCategory.trim())) {
      setToolData((prev: any) => ({
        ...prev,
        categories: [...prev.categories, customCategory.trim()],
      }));
      setCustomCategory("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setToolData({ ...toolData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      console.log("📡 Updating tool data:", toolData);
      const response = await fetch(`/api/updateTool?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toolData),
      });

      const data = await response.json();
      console.log("✅ Tool updated:", data);

      if (response.ok) {
        setMessage("✅ Tool updated successfully!");
        setTimeout(() => router.push("/tools"), 2000);
      } else {
        setMessage(data.error || "Error updating tool");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setMessage("Error updating tool");
    }
  };

  if (loading) return <p>Loading tool data...</p>;
  if (!toolData) return <p>Error loading tool data. Please try again.</p>;

  return (
    <div className="container mt-4">
      <h1>Edit Tool</h1>
      {message && <p className="alert alert-success">{message}</p>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tool Name</Form.Label>
          <Form.Control type="text" name="name" value={toolData.name || ""} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" value={toolData.description || ""} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Categories</Form.Label>
          <div>
            {defaultCategories.map((category) => (
              <Form.Check
                key={category}
                type="checkbox"
                label={category}
                checked={Array.isArray(toolData.categories) && toolData.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
            ))}
          </div>
          <div className="d-flex mt-2">
            <Form.Control
              type="text"
              placeholder="Add a new category..."
              value={customCategory}
              onChange={handleNewCategoryChange}
            />
            <Button variant="success" className="ms-2" onClick={handleAddNewCategory}>
              ➕ Add
            </Button>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website URL</Form.Label>
          <Form.Control type="url" name="website" value={toolData.website || ""} onChange={handleChange} required />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => router.push("/tools")}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      </Form>
    </div>
  );
}
