import React from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../app/page';
import Image from 'next/image';

type CartSidebarProps = {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  getCartTotal: () => number;
  isLoggedIn: boolean;
  handleCheckout: () => void;
  handleLogin: () => void;
  currentUser: { name: string; email: string } | null;
};

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  cart,
  onClose,
  updateQuantity,
  removeFromCart,
  getCartTotal,
  isLoggedIn,
  handleCheckout,
  handleLogin,
  currentUser,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg z-20 flex flex-col`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="h-full flex flex-col">
              {/* Cart Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" /> Your Cart
                </h2>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-grow overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <motion.div 
                    className="text-center text-gray-500 py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Your cart is empty</p>
                    <button
                      onClick={onClose}
                      className="mt-4 text-blue-500 hover:text-blue-600"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div 
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ type: 'spring' }}
                          className="flex items-start gap-4 mb-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <Image 
                            src={item.product.images[0] || 'https://via.placeholder.com/300'} 
                            alt={item.product.title}
                            width={64} 
                            height={64} 
                            className="object-cover rounded"
                          />
                        
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.product.title}</h3>
                          <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                          <div className="flex items-center mt-2">
                            <motion.button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border rounded-l hover:bg-gray-100"
                              whileTap={{ scale: 0.9 }}
                            >
                              -
                            </motion.button>
                            <span className="w-10 h-8 flex items-center justify-center border-t border-b">
                              {item.quantity}
                            </span>
                            <motion.button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border rounded-r hover:bg-gray-100"
                              whileTap={{ scale: 0.9 }}
                            >
                              +
                            </motion.button>
                          </div>
                        </div>
                        <motion.button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">Subtotal:</span>
                    <span className="font-bold text-lg">${getCartTotal().toFixed(2)}</span>
                  </div>
                  {isLoggedIn ? (
                    <motion.button 
                      onClick={handleCheckout}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Checkout Now
                    </motion.button>
                  ) : (
                    <motion.button 
                      onClick={handleLogin}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Login to Checkout
                    </motion.button>
                  )}
                  {isLoggedIn && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Logged in as {currentUser?.email}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
