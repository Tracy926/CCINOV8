import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './views/Dashboard';
import POS from './views/POS';
import Inventory from './views/Inventory';
import Reports from './views/Reports';
import { Product, Transaction, TransactionItem } from './types';
import { INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES } from './constants';

const App: React.FC = () => {
  // Persistence logic
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sarisaripay_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('sarisaripay_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('sarisaripay_transactions');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) }));
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('sarisaripay_theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('sarisaripay_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sarisaripay_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('sarisaripay_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('sarisaripay_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('sarisaripay_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleCompleteSale = (items: TransactionItem[], paymentMethod: 'cash' | 'digital') => {
    const total = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      items,
      total,
      paymentMethod,
      status: 'completed',
    };

    const updatedProducts = products.map(p => {
      const soldItem = items.find(item => item.productId === p.id);
      if (soldItem) {
        return { ...p, stock: Math.max(0, p.stock - soldItem.quantity) };
      }
      return p;
    });

    setProducts(updatedProducts);
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleAddCategory = (name: string) => {
    if (!categories.includes(name)) {
      setCategories(prev => [...prev, name]);
    }
  };

  const handleEditCategory = (oldName: string, newName: string) => {
    if (oldName === 'All') return;
    setCategories(prev => prev.map(c => c === oldName ? newName : c));
    setProducts(prev => prev.map(p => p.category === oldName ? { ...p, category: newName } : p));
  };

  const handleDeleteCategory = (name: string) => {
    if (name === 'All') return;
    setCategories(prev => prev.filter(c => c !== name));
    setProducts(prev => prev.map(p => p.category === name ? { ...p, category: 'Uncategorized' } : p));
    if (!categories.includes('Uncategorized') && name !== 'Uncategorized') {
      setCategories(prev => [...prev.filter(c => c !== name), 'Uncategorized']);
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen pb-safe bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden font-sans">
        <Routes>
          <Route path="/" element={<Dashboard transactions={transactions} products={products} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} />
          <Route path="/pos" element={<POS products={products} categories={categories} onCompleteSale={handleCompleteSale} />} />
          <Route 
            path="/inventory" 
            element={
              <Inventory 
                products={products} 
                categories={categories}
                onUpdateStock={handleUpdateStock} 
                onAddProduct={handleAddProduct}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            } 
          />
          <Route path="/reports" element={<Reports transactions={transactions} />} />
        </Routes>
        <Navigation />
      </div>
    </HashRouter>
  );
};

export default App;