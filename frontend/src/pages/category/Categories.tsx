import React, { useEffect, useState } from 'react'
import CategoryCard from '../../components/CategoryCard' // adjust path accordingly
import { Navigate, useNavigate } from 'react-router-dom'

interface Category {
  _id: string
  name: string
  description?: string
}

const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([])

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setCategories(data)
    }
    fetchCategories()
  }, [])

  const handleUpdate = (id: string) => {
    navigate(`/admin/update-category/${id}`)
  }


  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete')
      setCategories(prev => prev.filter(cat => cat._id !== id))
    } catch (error) {
      alert((error as Error).message)
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">Categories</h2>
      {categories.length === 0 && <p>No categories found.</p>}

      {categories.map(category => (
        <CategoryCard
          key={category._id}
          category={category}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}

export default CategoriesList
