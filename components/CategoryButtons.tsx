import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

interface CategoryButtonsProps {
  onCategorySelect: (category: string | null) => void;
}

export default function CategoryButtons({ onCategorySelect }: CategoryButtonsProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
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

    fetchCategories();
  }, []);

  // ✅ Fix: Add a refresh function to update categories after adding a new one
  const refreshCategories = async () => {
    const response = await fetch("/api/getCategories");
    if (response.ok) {
      const data: string[] = await response.json();
      setCategories(data);
    }
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
      <Button
        variant={!selectedCategory ? "dark" : "outline-dark"}
        onClick={() => handleCategoryClick(null)}
      >
        Show All
      </Button>
    </div>
  );
}
