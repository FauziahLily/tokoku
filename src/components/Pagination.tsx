import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, paginate }) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      <motion.button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
        whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
        whileTap={{ scale: currentPage === 1 ? 1 : 0.9 }}
      >
        <ChevronLeft className="h-5 w-5" />
      </motion.button>
      <div className="flex space-x-2">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <motion.button
              key={pageNum}
              onClick={() => paginate(pageNum)}
              className={`w-10 h-10 rounded-full ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {pageNum}
            </motion.button>
          );
        })}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <span className="flex items-end px-1">...</span>
        )}
      </div>
      <motion.button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
        whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
        whileTap={{ scale: currentPage === totalPages ? 1 : 0.9 }}
      >
        <ChevronRight className="h-5 w-5" />
      </motion.button>
    </div>
  );
};

export default Pagination;
