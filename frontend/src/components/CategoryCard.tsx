import React from 'react'

interface Category {
  _id: string
  name: string
  description?: string
}

interface CategoryCardProps {
  category: Category
  onUpdate: (id: string) => void
  onDelete: (id: string) => void
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onUpdate, onDelete }) => {
  return (
    <div className="flex justify-between items-center border p-4 rounded shadow mb-3">
      <div>
        <h3 className="text-lg font-semibold">{category.name}</h3>
        {category.description && (
          <p className="text-gray-600 mt-1">{category.description}</p>
        )}
      </div>

      <div className="space-x-2">
        <button
          onClick={() => onUpdate(category._id)}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Update
        </button>
        <button
          onClick={() => onDelete(category._id)}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default CategoryCard
