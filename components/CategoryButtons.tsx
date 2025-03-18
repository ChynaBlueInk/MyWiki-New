import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

interface CategoryButtonsProps {
  onCategorySelect: (category: string | null) => void;
}

export default function CategoryButtons({ onCategorySelect }: CategoryButtonsProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // ✅ Function to fetch categories dynamically
  const fetchCategories = async () => {
    try {
      console.log("📡 Fetching categories...");
      const response = await fetch("/api/getCategories");

      if (!response.ok) {
        throw new Error(`Failed to fetch categories. Status: ${response.status}`);
      }

      const data: string[] = await response.json();
      console.log("✅ Categories retrieved:", data);

      setCategories(data);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Function to refresh categories after an update
  const refreshCategories = async () => {
    await fetchCategories();
  };

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      {categories.length > 0 ? (
        categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "primary" : "outline-primary"}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))
      ) : (
        <p>No categories available</p>
      )}
      <Button variant={!selectedCategory ? "dark" : "outline-dark"} onClick={() => handleCategoryClick(null)}>
        Show All
      </Button>
      {/* ✅ Fix: Ensure `onClick` is wrapped in a function */}
      <Button variant="warning" onClick={() => refreshCategories()}>
        🔄 Refresh Categories
      </Button>
    </div>
  );
}
