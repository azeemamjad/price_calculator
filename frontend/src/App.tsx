import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
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
import CustomerDashboard from './pages/CustomerDashboard'
import CustomerHeader from './components/CustomerHeader'
import CusProducts from './components/CusProducts'
import Cart from './components/Cart'
import ProductDetail from './pages/products/ProductDetail'
function App() {
  const [productSearchQuery, setProductSearchQuery] = useState('')
  const [categorySearchQuery, setCategorySearchQuery] = useState('')

  return (
    <>
      <CustomerHeader />
      <AdminHeader />
      <AdminSubHeader
        onSearchProduct={setProductSearchQuery}
        onSearchCategory={setCategorySearchQuery}
      />
      <Routes>
        <Route path="/" element={<HomeController />} />

        // customer routes
        <Route path="/login" element={<Login role='customer' />} />
        <Route path="/register" element={<Register role='customer' />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/products" element={<CusProducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/customer/products-detail/:id' element ={<ProductDetail/>}/>
        // admin routes
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/login" element={<Login role='admin' />} />
        <Route path='/admin/register' element={<Register role='admin' />} />

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
