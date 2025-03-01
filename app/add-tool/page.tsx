'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const initialCategories = ['Writing', 'Video', 'Music', 'Images', 'All-Round']

export default function AddTool() {
  const router = useRouter()
  const [toolData, setToolData] = useState({
    name: '',
    description: '',
    categories: [] as string[],
    pricing: '',
    website: '',
    submittedBy: '',
    thumbnail: null as File | null,
  })
  const [categories, setCategories] = useState(initialCategories)
  const [newCategory, setNewCategory] = useState('')
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log('Submitting tool:', toolData)
    // Redirect to home page after submission
    router.push('/')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setToolData({ ...toolData, [e.target.name]: e.target.value })
  }

  const handleCategoryChange = (category: string) => {
    setToolData(prevData => ({
      ...prevData,
      categories: prevData.categories.includes(category)
        ? prevData.categories.filter(c => c !== category)
        : [...prevData.categories, category]
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setToolData({ ...toolData, thumbnail: e.target.files[0] })
    }
  }

  const handleAddNewCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setToolData(prevData => ({
        ...prevData,
        categories: [...prevData.categories, newCategory]
      }))
      setNewCategory('')
      setIsAddingNewCategory(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New AI Tool</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Tool Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={toolData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={toolData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Categories (Select all that apply)</Label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={toolData.categories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <Label htmlFor={`category-${category}`}>{category}</Label>
              </div>
            ))}
          </div>
          {!isAddingNewCategory ? (
            <Button type="button" variant="outline" onClick={() => setIsAddingNewCategory(true)} className="mt-2">
              Add New Category
            </Button>
          ) : (
            <div className="flex items-center space-x-2 mt-2">
              <Input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
              />
              <Button type="button" onClick={handleAddNewCategory}>Add</Button>
              <Button type="button" variant="outline" onClick={() => setIsAddingNewCategory(false)}>Cancel</Button>
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="pricing">Pricing</Label>
          <Input
            type="text"
            id="pricing"
            name="pricing"
            value={toolData.pricing}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            type="url"
            id="website"
            name="website"
            value={toolData.website}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="submittedBy">Submitted By</Label>
          <Input
            type="text"
            id="submittedBy"
            name="submittedBy"
            value={toolData.submittedBy}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input
            type="file"
            id="thumbnail"
            name="thumbnail"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <Button type="submit">Add Tool</Button>
      </form>
    </div>
  )
}

