
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Lucky Me Pancit Canton', price: 15, stock: 48, category: 'Noodles', unit: 'pcs' },
  { id: '2', name: 'Coca-Cola 290ml', price: 18, stock: 24, category: 'Drinks', unit: 'bottles' },
  { id: '3', name: 'Skyflakes Single', price: 8, stock: 60, category: 'Snacks', unit: 'pcs' },
  { id: '4', name: 'Great Taste Coffee 3-in-1', price: 10, stock: 100, category: 'Coffee', unit: 'sachets' },
  { id: '5', name: 'Safeguard White 60g', price: 45, stock: 12, category: 'Personal Care', unit: 'pcs' },
  { id: '6', name: 'Selecta Cornetto', price: 30, stock: 15, category: 'Frozen', unit: 'pcs' },
  { id: '7', name: 'Rice (Local)', price: 55, stock: 25, category: 'Grains', unit: 'kg' },
  { id: '8', name: 'Egg (Large)', price: 9, stock: 30, category: 'Fresh', unit: 'pcs' },
];

export const CATEGORIES = [
  'All', 'Noodles', 'Drinks', 'Snacks', 'Coffee', 'Personal Care', 'Frozen', 'Grains', 'Fresh'
];
