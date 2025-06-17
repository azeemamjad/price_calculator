import { Routes, Route } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import AdminRegister from './pages/AdminRegister'
import AddProduct from './pages/products/AddProduct'
import UpdateProduct from './pages/products/UpdateProduct'
import SearchProduct from './pages/products/SearchProduct'

import HomeController from './HomeController'
import ProtectedRoute from './ProtectedRoute'

import AdminHeader from './components/AdminHeader'
import AdminSubHeader from './components/AdminSubHeader'
import AdminDashboard from './pages/AdminDashboard'
import { useState } from 'react'
import Products from './pages/products/Products'

import Categories from './pages/category/Categories'
import AddCategory from './pages/category/AddCategory'
import UpdateCategory from './pages/category/UpdateCategory'

function App() {
  const [productSearchQuery, setProductSearchQuery] = useState('')
  const [categorySearchQuery, setCategorySearchQuery] = useState('')

  return (
    <>
      <AdminHeader />
      <AdminSubHeader
        onSearchProduct={setProductSearchQuery}
        onSearchCategory={setCategorySearchQuery}
      />
      <Routes>
        <Route path="/" element={<HomeController />} />

        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path='/admin/register' element={<AdminRegister />} />

        <Route path='/admin/products' element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/admin/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/admin/update-product/:id" element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>} />
        <Route path="/admin/product/search" element={<ProtectedRoute><SearchProduct /></ProtectedRoute>} />

        <Route path='/admin/categories' element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path='/admin/add-category' element={<ProtectedRoute><AddCategory /></ProtectedRoute>} />
        <Route path="/admin/update-category/:id" element={<ProtectedRoute><UpdateCategory /></ProtectedRoute>} />


      </Routes>
    </>
  )
}

export default App
