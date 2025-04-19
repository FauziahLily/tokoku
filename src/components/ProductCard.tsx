import React from 'react';
import { ShoppingCart, Heart, } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../app/page';
import Image from 'next/image';

type ProductCardProps = {
  product: Product;
  addToCart: (product: Product) => void;
  toggleFavorite: (productId: number) => void;
  favorites: number[];
  onSelect: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, toggleFavorite, favorites, onSelect }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all flex flex-col h-full border border-gray-100"
      onClick={onSelect}
    >
      <div 
        className="h-48 overflow-hidden cursor-pointer relative"
      >
        <Image 
          src={product.images[0] || 'https://via.placeholder.com/300'} 
          alt={product.title}
          width={300} 
          height={300}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300';
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full backdrop-blur-sm"
        >
          <Heart 
            className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit mb-2">
          {product.category.name}
        </span>
        <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2 flex-grow text-sm">{product.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
          <motion.button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
