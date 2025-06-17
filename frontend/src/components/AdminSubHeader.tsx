import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'


interface AdminSubHeaderProps {
  onSearchProduct: (query: string) => void
  onSearchCategory: (query: string) => void
}

const AdminSubHeader = ({ onSearchProduct, onSearchCategory }: AdminSubHeaderProps) => {
  const location = useLocation()
  const path = location.pathname

  const navigate = useNavigate()

  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [categorySearchTerm, setCategorySearchTerm] = useState('')

  // Products subheader
  if (path.startsWith('/admin/products')) {
    const isOnAddProductPage = path === '/admin/add-product'
    const isOnProductListPage = path === '/admin/products'

    return (
      <div className="bg-blue-100 text-blue-800 px-4 py-3 flex items-center justify-between border-b border-blue-300">
        <div className="space-x-6">
          {!isOnAddProductPage && (
            <Link to="/admin/add-product" className="font-medium hover:underline">
              + Add Product
            </Link>
          )}
          {!isOnProductListPage && (
            <Link to="/admin/products" className="font-medium hover:underline">
              View All Products
            </Link>
          )}
        </div>

        <form
          onSubmit={e => {
            e.preventDefault()
            const trimmed = productSearchTerm.trim()
            if (trimmed) {
              onSearchProduct(trimmed)
              navigate(`/admin/product/search?q=${encodeURIComponent(trimmed)}`)
            }
          }}
          className="flex space-x-2"
          role="search"
        >

          <input
            type="text"
            placeholder="Search products..."
            value={productSearchTerm}
            onChange={e => setProductSearchTerm(e.target.value)}
            className="px-3 py-1 rounded border border-blue-300 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>
    )
  }

  // Categories subheader
  if (path.startsWith('/admin/categories')) {
    const isOnAddCategoryPage = path === '/admin/add-category'
    const isOnCategoryListPage = path === '/admin/categories'

    return (
      <div className="bg-green-100 text-green-800 px-4 py-3 flex items-center justify-between border-b border-green-300">
        <div className="space-x-6">
          {!isOnAddCategoryPage && (
            <Link to="/admin/add-category" className="font-medium hover:underline">
              + Add Category
            </Link>
          )}
          {!isOnCategoryListPage && (
            <Link to="/admin/categories" className="font-medium hover:underline">
              View All Categories
            </Link>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default AdminSubHeader
