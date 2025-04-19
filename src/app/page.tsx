"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, LogIn, LogOut, User, Heart, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TokokuIcon from '../components/TokokuIcon';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import LoginModal from '../components/LoginModal';
import Pagination from '../components/Pagination';
import Image from 'next/image';
import { mockProducts } from "@/lib/mockProducts"; 
import './globals.css';

// Product type definition
export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    name: string;
  };
  images: string[];
};

// Cart item type
export type CartItem = {
  product: Product;
  quantity: number;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{name: string, email: string} | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const productsPerPage = 4;

  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.products); // Akses data.products
      } catch (err) {
        console.error(err);
        // Ganti ke mock data saat fetch gagal
        setProducts(mockProducts);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  

  const filteredProducts = products.filter(product =>
    (product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );
  
  

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      setIsLoggedIn(true);
      setCurrentUser({
        name: loginForm.email.split('@')[0],
        email: loginForm.email
      });
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '' });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCart([]);
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    alert(`🎉 Thank you, ${currentUser?.name}! Your order of $${getCartTotal().toFixed(2)} was successful!`);
    setCart([]);
    setIsCartOpen(false);
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-bold text-blue-600 flex items-center">
            <TokokuIcon />
            <motion.span 
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 3 }}
            >
              Tokoku
            </motion.span>
          </div>
          
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="text-sm font-medium">{currentUser?.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-sm hover:text-blue-600 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-1" /> Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center text-sm hover:text-blue-600 transition-colors"
              >
                <LogIn className="h-5 w-5 mr-1" /> Login
              </button>
            )}
            <motion.button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 pb-16">
        {isLoggedIn && (
          <motion.div 
            className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold text-blue-800">Welcome back, {currentUser?.name}!</h2>
            <p className="text-blue-600">Logged in as {currentUser?.email}</p>
          </motion.div>
        )}
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Our Products</h1>
          {searchQuery && (
            <p className="text-gray-500">
              Showing {filteredProducts.length} results for &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                addToCart={addToCart} 
                toggleFavorite={toggleFavorite} 
                favorites={favorites} 
                onSelect={() => setSelectedProduct(product)} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-500">No products found</h3>
              <p className="text-gray-400 mt-2">Try searching with different keywords</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="mt-4 text-blue-500 hover:text-blue-600"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            paginate={paginate} 
          />
        )}
      </main>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{selectedProduct.title}</h2>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="h-48 md:h-80 overflow-hidden rounded-xl bg-gray-100">
                      <Image 
                        src={selectedProduct.images[0] || 'https://cdn.dummyjson.com/products/images'} 
                        alt={selectedProduct.title}
                        width={300}  // Specify a width
                        height={300} // Specify a height
                        className="w-full h-full object-contain"
                        loading='lazy'
                      />
                    </div>
                    {/* <div className="grid grid-cols-3 gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i} 
                          className="h-20 bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                        >
                          <Image 
                            src={selectedProduct.images[i] || 'https://cdn.dummyjson.com/products/images'} 
                            alt={`Image ${i + 1} of ${selectedProduct.title}`} 
                            width={300} 
                            height={300} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ))}
                    </div> */}
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                        {selectedProduct.category.name}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Description</h3>
                      <p className="text-gray-700">{selectedProduct.description}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold">${selectedProduct.price.toFixed(2)}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleFavorite(selectedProduct.id)}
                            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <Heart 
                              className={`h-5 w-5 ${favorites.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                            />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4">
                        <motion.button 
                          onClick={() => {
                            addToCart(selectedProduct);
                            setSelectedProduct(null);
                          }}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        cart={cart} 
        onClose={() => setIsCartOpen(false)} 
        updateQuantity={updateQuantity} 
        removeFromCart={removeFromCart} 
        getCartTotal={getCartTotal} 
        isLoggedIn={isLoggedIn} 
        handleCheckout={handleCheckout} 
        handleLogin={() => {
          setShowLoginModal(true);
          setIsCartOpen(false);
        }}
        currentUser={currentUser}
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        loginForm={loginForm} 
        setLoginForm={setLoginForm} 
        handleLogin={handleLogin} 
      />
    </>
  );
}
