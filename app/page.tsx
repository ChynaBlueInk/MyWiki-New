"use client";

import { useState, useEffect } from "react";
import CategoryCard from "../components/CategoryCard";
import { Button } from "react-bootstrap";

type Tool = {
  toolId: string;
  name: string;
  description: string;
  categories?: string[];
  category?: string;
  createdAt?: string;
};

export default function HomePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch("/api/getTools");
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data: Tool[] = await response.json();

        const normalizedTools = data.map((tool) => ({
          ...tool,
          categories: tool.categories ?? (tool.category ? [tool.category] : []),
        }));

        setTools(normalizedTools);
        setLoading(false);

        const counts: Record<string, number> = {};
        normalizedTools.forEach((tool) => {
          tool.categories?.forEach((cat) => {
            counts[cat] = (counts[cat] || 0) + 1;
          });
        });
        setCategoryCounts(counts);
      } catch (err) {
        console.error("❌ Error fetching tools:", err);
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Welcome to the AI Tools Wiki</h1>

      <div className="mb-4">
        <p>Discover and share AI tools in a growing, community-curated directory.</p>
        <p>On the <strong>Tools</strong> page, you can:</p>
        <ul>
          <li>🔍 Search tools by name or keyword</li>
          <li>🗂️ Filter by category</li>
          <li>📝 Add your own tools</li>
          <li>⭐ Leave reviews and ratings</li>
          <li>✏️ Edit or delete your submissions</li>
        </ul>
        <p>Start by choosing a category below or head directly to the full tool list.</p>
      </div>

      <div className="d-flex gap-3 mb-5">
        <Button variant="primary" href="/tools">
          🔍 Browse All Tools
        </Button>
        <Button variant="success" href="/add-tool">
          ➕ Add New Tool
        </Button>
      </div>

      <h2 className="h4 mb-3">Browse by Category</h2>
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="row">
          {Object.entries(categoryCounts).map(([title, count]) => (
            <div key={title} className="col-md-4 mb-4">
              <CategoryCard title={title} count={count} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
