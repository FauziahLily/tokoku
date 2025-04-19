import { Product } from "@/app/page";

export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product 1',
    category: { name: 'Category A' },
    images: ['https://placekitten.com/300/300'],
    price: 19.99,
    description: 'Ini adalah produk mock.',
  },
  {
    id: 2,
    title: 'Product 2',
    category: { name: 'Category B' },
    images: ['https://placekitten.com/300/300'],
    price: 29.99,
    description: 'Produk mock lainnya.',
  },
];