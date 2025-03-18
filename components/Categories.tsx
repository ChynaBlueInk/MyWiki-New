import { useState, useEffect } from "react";

interface CategoriesProps {
  onCategorySelect: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/getCategories");

        if (!response.ok) {
          throw new Error(`Failed to fetch categories. Status: ${response.status}`);
        }

        const data: string[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="mb-4">
      <h2 className="h4 mb-3">Categories</h2>
      <div className="d-flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            className="btn btn-outline-primary"
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </button>
        ))}
        <button className="btn btn-secondary" onClick={() => onCategorySelect("")}>
          Show All
        </button>
      </div>
    </div>
  );
};

export default Categories;
