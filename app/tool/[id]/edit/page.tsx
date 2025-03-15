"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";

export default function EditToolPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [toolData, setToolData] = useState<{
    name: string;
    description: string;
    categories: string[];
    pricing: string;
    website: string;
    submittedBy: string;
    dateSubmitted: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // ✅ Fetch categories dynamically from API
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const fetchTool = async () => {
      try {
        console.log(`📡 Fetching tool details for ID: ${id}`);

        const response = await fetch(`/api/getTool?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tool details");
        }

        const data = await response.json();
        console.log("✅ Tool data loaded:", data);

        setToolData({
          name: data.name || "",
          description: data.description || "",
          website: data.website || "",
          pricing: data.pricing || "",
          submittedBy: data.submittedBy || "Unknown",
          dateSubmitted: data.dateSubmitted || "Unknown",
          categories: Array.isArray(data.categories) ? data.categories : [],
        });

      } catch (error) {
        console.error("❌ Error fetching tool:", error);
        setMessage("Error loading tool data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        console.log("📡 Fetching category options...");
        const response = await fetch(`/api/getCategories`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        console.log("✅ Categories loaded:", data);

        if (Array.isArray(data)) {
          setCategoryOptions(data);
        }
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
      }
    };

    fetchTool();
    fetchCategories();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (toolData) {
      setToolData((prevData) => ({
        ...prevData!,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleCategoryChange = (category: string) => {
    setToolData((prevData) => {
      if (!prevData) return null;

      return {
        ...prevData,
        categories: prevData.categories.includes(category)
          ? prevData.categories.filter((c: string) => c !== category)
          : [...prevData.categories, category],
      };
    });
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim() && !categoryOptions.includes(newCategory.trim())) {
      setCategoryOptions((prevOptions) => [...prevOptions, newCategory.trim()]);
      setToolData((prevData) => {
        if (!prevData) return null;

        return {
          ...prevData,
          categories: [...prevData.categories, newCategory.trim()],
        };
      });
      setNewCategory("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      console.log("📡 Updating tool data:", toolData);

      if (!toolData) {
        setMessage("Error: No tool data available.");
        return;
      }

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
  if (!toolData) return <p>{message}</p>;

  return (
    <div className="container mt-4">
      <h1>Edit Tool</h1>
      {message && <p className="alert alert-danger">{message}</p>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tool Name</Form.Label>
          <Form.Control type="text" name="name" value={toolData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" value={toolData.description} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Select Categories:</Form.Label>
          <div className="d-flex flex-wrap gap-3">
            {categoryOptions.map((category) => (
              <div key={category} className="form-check d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={category}
                  checked={Array.isArray(toolData.categories) && toolData.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <label htmlFor={category} className="form-check-label ms-2">{category}</label>
              </div>
            ))}
          </div>

          <div className="d-flex mt-2">
            <Form.Control
              type="text"
              placeholder="Add a new category..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button variant="success" className="ms-2" onClick={handleAddNewCategory}>
              ➕ Add
            </Button>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Pricing</Form.Label>
          <Form.Control type="text" name="pricing" value={toolData.pricing} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website URL</Form.Label>
          <Form.Control type="url" name="website" value={toolData.website} onChange={handleChange} required />
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
