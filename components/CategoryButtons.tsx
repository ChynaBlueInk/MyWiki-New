"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "react-bootstrap";

interface CategoryButtonsProps {
  onCategorySelect: (category: string | null) => void;
}

export default function CategoryButtons({ onCategorySelect }: CategoryButtonsProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get("category");

  useEffect(() => {
    if (currentCategory) {
      setSelectedCategory(currentCategory);
    } else {
      setSelectedCategory(null);
    }
  }, [currentCategory]);

  useEffect(() => {
    const fetchFilteredCategories = async () => {
      try {
        const [catRes, toolsRes] = await Promise.all([
          fetch("/api/getCategories"),
          fetch("/api/getTools"),
        ]);

        if (!catRes.ok || !toolsRes.ok) {
          throw new Error("Failed to fetch categories or tools.");
        }

        const catData: string[] = await catRes.json();
        const toolsData: any[] = await toolsRes.json();

        const usedCategories = new Set(
          toolsData.flatMap((tool) => tool.categories || [])
        );

        const filtered = catData.filter((cat) => usedCategories.has(cat));
        setCategories(filtered);
      } catch (error) {
        console.error("❌ Error fetching filtered categories:", error);
      }
    };

    fetchFilteredCategories();
  }, []);

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    onCategorySelect(category);

    if (category) {
      // Update the URL to include selected category
      router.push(`/tools?category=${encodeURIComponent(category)}`);
    } else {
      // Reset URL to base /tools (no filter)
      router.push("/tools");
    }
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
