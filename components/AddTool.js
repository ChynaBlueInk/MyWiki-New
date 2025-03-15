import { useState, useEffect } from "react";

export default function AddTool() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    categories: [],
    website: "",
    rating: "",
  });

  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [newCategory, setNewCategory] = useState(""); // Track new category input

  // Fetch categories when component loads
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/getCategories");
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        console.log("✅ Fetched categories:", data);
        setCategories(data);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle category selection (checkboxes)
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      categories: prevForm.categories.includes(selectedCategory)
        ? prevForm.categories.filter((cat) => cat !== selectedCategory)
        : [...prevForm.categories, selectedCategory],
    }));
  };

  // Handle adding a new category
  const handleAddNewCategory = async () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      try {
        const response = await fetch("/api/addCategory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory.trim() }),
        });

        if (!response.ok) throw new Error("Failed to add category");

        // Update category list immediately after adding
        setCategories((prevCategories) => [...prevCategories, newCategory.trim()]);
        setForm((prevForm) => ({
          ...prevForm,
          categories: [...prevForm.categories, newCategory.trim()],
        }));
        setNewCategory("");
      } catch (error) {
        console.error("❌ Error adding category:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.description || form.categories.length === 0 || !form.website || !form.rating) {
      setMessage("Please fill out all fields and select at least one category.");
      return;
    }

    try {
      const response = await fetch("/api/addTool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Tool added successfully!");
        setForm({ name: "", description: "", categories: [], website: "", rating: "" });
      } else {
        setMessage(data.error || "Error adding tool");
      }
    } catch (error) {
      setMessage("Error submitting tool");
    }
  };

  return (
    <div>
      <h2>Add a New Tool</h2>
      <form onSubmit={handleSubmit}>
        <label>Categories:</label>
        <div>
          {categories.length > 0 ? (
            categories.map((category) => (
              <label key={category}>
                <input type="checkbox" value={category} onChange={handleCategoryChange} />
                {category}
              </label>
            ))
          ) : (
            <p>Loading categories...</p>
          )}
        </div>

        <input type="text" placeholder="Add a new category..." value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
        <button type="button" onClick={handleAddNewCategory}>Add</button>
      </form>
    </div>
  );
}
