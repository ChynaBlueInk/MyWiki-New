interface CategoriesProps {
  onCategorySelect: (category: string) => void; // ✅ Explicitly define prop type
}

const Categories: React.FC<CategoriesProps> = ({ onCategorySelect }) => {
  const categories = ["Writing", "Video", "Music", "Images", "All-Round"];

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
        {/* ✅ TODO: Implement actual filtering logic */}
        <button className="btn btn-secondary" onClick={() => onCategorySelect("")}>
          Show All
        </button>
      </div>
    </div>
  );
};

export default Categories;
