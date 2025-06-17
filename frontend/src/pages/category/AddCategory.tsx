import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Category {
  name: string
  description?: string
}

const AddCategory = () => {
  const [category, setCategory] = useState<Category>({ name: '', description: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCategory(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!category.name.trim()) {
      setError('Category name is required.')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
        });


      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to add category')
      }

      // On success, redirect to categories list page
      navigate('/admin/categories')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Category</h2>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-1">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={category.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-green-300"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block font-semibold mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={category.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-green-300"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Add Category'}
        </button>
      </form>
    </div>
  )
}

export default AddCategory
