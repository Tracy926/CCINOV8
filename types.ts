export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  unit: string;
}

export interface TransactionItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  id: string;
  timestamp: Date;
  items: TransactionItem[];
  total: number;
  paymentMethod: 'cash' | 'digital';
  status: 'completed' | 'pending';
}

export interface BusinessInsight {
  summary: string;
  recommendations: string[];
}