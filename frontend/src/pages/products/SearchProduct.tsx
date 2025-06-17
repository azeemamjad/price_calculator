import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ProductCard from '../../components/ProductCard' // adjust path if needed

interface Product {
  _id: string
  title: string
  description?: string
  price: number
  discount: number
  category: string
  pictures: string[]
}

function SearchProduct() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset page to 1 when query changes
  useEffect(() => {
    setPage(1)
  }, [query])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setTotalPages(1)
      return
    }

    const fetchResults = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
          }
        )

        if (!res.ok) throw new Error('Failed to fetch')

        const data = await res.json()
        setResults(data.products || [])
        setTotalPages(data.totalPages || 1)
        setError('')
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, page])

  // Placeholder handlers - replace with your real logic
  const handleUpdate = (productId: string) => {
    console.log('Update product:', productId)
    // e.g. navigate to update form page or open modal
  }

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })
      if (!res.ok) throw new Error('Delete failed')
      // Refresh list after deletion
      setResults(results.filter((p) => p._id !== productId))
    } catch (err) {
      alert('Failed to delete product')
      console.error(err)
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search Products</h2>

      <p className="mb-4 text-gray-500">
        Search query: <span className="font-semibold">{query}</span>
      </p>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && results.length === 0 && !error && (
        <p className="text-gray-500">No products found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchProduct
