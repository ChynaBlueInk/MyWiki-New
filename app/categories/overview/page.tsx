"use client";

import { useEffect, useState } from "react";
import CategoryCard from "../../../components/CategoryCard"; // ✅ Updated import path

type Tool = {
  toolId: string;
  categories?: string[];
  category?: string;
};

type CategoryData = {
  title: string;
  count: number;
};

const OverviewPage = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toolsRes, catsRes] = await Promise.all([
          fetch("/api/getTools"),
          fetch("/api/getCategories"),
        ]);

        const toolsData: Tool[] = await toolsRes.json();
        const catNames: string[] = await catsRes.json();

        const toolMap: Record<string, number> = {};

        toolsData.forEach((tool) => {
          const cats = tool.categories ?? (tool.category ? [tool.category] : []);
          cats.forEach((cat) => {
            const key = cat.trim();
            toolMap[key] = (toolMap[key] || 0) + 1;
          });
        });

        const categoryList: CategoryData[] = catNames.map((name) => ({
          title: name,
          count: toolMap[name] || 0,
        }));

        setTools(toolsData);
        setCategories(categoryList);
      } catch (err) {
        console.error("❌ Failed to load tools or categories:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-3">Explore AI Tool Categories</h1>
      <div className="row g-4">
        {categories.map((cat) => (
          <div key={cat.title} className="col-sm-6 col-md-4 col-lg-3">
            <CategoryCard
              title={cat.title}
              count={cat.count}
              imageUrl={`/images/category-placeholder.png`} // Replace with real icons later
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewPage;
