import { useState } from "react"

const initialCategories = ["Writing", "Video", "Music", "Images", "All-Round"]

function AddTool() {
  const [toolData, setToolData] = useState({
    name: "",
    description: "",
    categories: [],
    pricing: "",
    website: "",
    submittedBy: "",
    thumbnail: null,
  })
  const [categories, setCategories] = useState(initialCategories)
  const [newCategory, setNewCategory] = useState("")
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log("Submitting tool:", toolData)
    // Redirect to home page after submission (you'll need to implement routing)
  }

  const handleChange = (e) => {
    setToolData({ ...toolData, [e.target.name]: e.target.value })
  }

  const handleCategoryChange = (category) => {
    setToolData((prevData) => ({
      ...prevData,
      categories: prevData.categories.includes(category)
        ? prevData.categories.filter((c) => c !== category)
        : [...prevData.categories, category],
    }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setToolData({ ...toolData, thumbnail: e.target.files[0] })
    }
  }

  const handleAddNewCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setToolData((prevData) => ({
        ...prevData,
        categories: [...prevData.categories, newCategory],
      }))
      setNewCategory("")
      setIsAddingNewCategory(false)
    }
  }

  return (
    <div className="container">
      <h1 className="title">Add New AI Tool</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Tool Name</label>
          <input type="text" id="name" name="name" value={toolData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={toolData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Categories (Select all that apply)</label>
          <div className="categories-container">
  {categories.map((category) => (
    <div key={category} className="category-item">
      <input
        type="checkbox"
        id={`category-${category}`}
        checked={toolData.categories.includes(category)}
        onChange={() => handleCategoryChange(category)}
      />
      <label htmlFor={`category-${category}`} className="category-label">{category}</label>
    </div>
  ))}

          </div>
          {!isAddingNewCategory ? (
            <button type="button" className="button outline" onClick={() => setIsAddingNewCategory(true)}>
              Add New Category
            </button>
          ) : (
            <div className="new-category-input">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
              />
              <button type="button" onClick={handleAddNewCategory}>
                Add
              </button>
              <button type="button" className="outline" onClick={() => setIsAddingNewCategory(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="pricing">Pricing</label>
          <input type="text" id="pricing" name="pricing" value={toolData.pricing} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input type="url" id="website" name="website" value={toolData.website} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="submittedBy">Submitted By</label>
          <input
            type="text"
            id="submittedBy"
            name="submittedBy"
            value={toolData.submittedBy}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="thumbnail">Thumbnail</label>
          <input type="file" id="thumbnail" name="thumbnail" onChange={handleFileChange} accept="image/*" />
        </div>
        <button type="submit" className="button">
          Add Tool
        </button>
      </form>
    </div>
  )
}

export default AddTool

