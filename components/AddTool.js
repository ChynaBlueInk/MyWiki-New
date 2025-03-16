import { useState, useEffect } from "react";

export default function AddTool() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || ""; // Ensure API calls work on both localhost & Vercel

  const [form, setForm] = useState({
    name: "",
    description: "",
    categories: [],
    website: "",
    pricing: "",
    rating: 0, // Default to 0 for rating stars
    review: "", // ✅ Added review field
  });

  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [newCategory, setNewCategory] = useState(""); // Track new category input
  const [loading, setLoading] = useState(true); // Track loading state

  // ✅ Fetch categories when component loads
  useEffect(() => {
    async function fetchCategories() {
      try {
        console.log("📡 Fetching categories from AWS...");
        const response = await fetch(`${API_URL}/api/getCategories`);

        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        console.log("✅ Fetched categories:", data);
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // ✅ Handle text input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle category selection (checkboxes)
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      categories: prevForm.categories.includes(selectedCategory)
        ? prevForm.categories.filter((cat) => cat !== selectedCategory)
        : [...prevForm.categories, selectedCategory],
    }));
  };

  // ✅ Handle star rating selection
  const handleRatingChange = (selectedRating) => {
    setForm((prevForm) => ({
      ...prevForm,
      rating: selectedRating,
    }));
  };

  // ✅ Handle adding a new category
  const handleAddNewCategory = async () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      try {
        console.log("➕ Adding new category:", newCategory);
        const response = await fetch(`${API_URL}/api/addCategory`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory.trim() }),
        });

        if (!response.ok) throw new Error("Failed to add category");

        // ✅ Update category list immediately after adding
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

  // ✅ Handle form submission (Add Tool)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.description || form.categories.length === 0 || !form.website || !form.rating) {
      setMessage("❌ Please fill out all fields and select at least one category.");
      return;
    }

    try {
      console.log("📡 Submitting tool:", form);
      const response = await fetch(`${API_URL}/api/addTool`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Tool added successfully!");
        setForm({ name: "", description: "", categories: [], website: "", pricing: "", rating: 0, review: "" });
      } else {
        setMessage(data.error || "Error adding tool");
      }
    } catch (error) {
      setMessage("❌ Error submitting tool");
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} className="p-4">
        {/* ✅ Name */}
        <label className="form-label">Name:</label>
        <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />

        {/* ✅ Description */}
        <label className="form-label">Description:</label>
        <textarea name="description" className="form-control" value={form.description} onChange={handleChange} required />

        {/* ✅ Select Categories */}
        <label className="form-label">Select Categories:</label>
        <div className="d-flex flex-wrap">
          {loading ? (
            <p>Loading categories...</p>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <div key={category} className="form-check me-3">
                <input type="checkbox" className="form-check-input" value={category} onChange={handleCategoryChange} />
                <label className="form-check-label">{category}</label>
              </div>
            ))
          ) : (
            <p>No categories found. Try adding one below.</p>
          )}
        </div>

        {/* ✅ Add New Category (Inline Button) */}
        <div className="input-group mt-2">
          <input type="text" className="form-control" placeholder="Add a new category..." value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          <button type="button" className="btn btn-secondary" onClick={handleAddNewCategory}>Add Category</button>
        </div>

        {/* ✅ Pricing */}
        <label className="form-label mt-3">Pricing:</label>
        <input type="text" name="pricing" className="form-control" value={form.pricing} onChange={handleChange} placeholder="Free, Paid, Subscription, etc." />

        {/* ✅ Website */}
        <label className="form-label mt-3">Website:</label>
        <input type="url" name="website" className="form-control" value={form.website} onChange={handleChange} required />

        {/* ✅ Rating (Stars) */}
        <label className="form-label mt-3">Rating:</label>
        <div className="mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`star ${form.rating >= star ? "text-warning" : "text-secondary"}`} onClick={() => handleRatingChange(star)} style={{ cursor: "pointer", fontSize: "1.5rem" }}>
              ★
            </span>
          ))}
        </div>

        {/* ✅ Review */}
        <label className="form-label">Review:</label>
        <textarea name="review" className="form-control" value={form.review} onChange={handleChange} />

        {/* ✅ Submit Button */}
        <button type="submit" className="btn btn-primary mt-3">Submit Tool</button>
      </form>

      {message && <p className="mt-3 alert alert-info">{message}</p>}
    </div>
  );
}
