
import React, { useState } from 'react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  categories: string[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onAddProduct: (newProduct: Product) => void;
  onAddCategory: (name: string) => void;
  onEditCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ 
  products, 
  categories, 
  onUpdateStock, 
  onAddProduct,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [search, setSearch] = useState('');
  
  // Product Form Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(categories[1] || 'General');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('pcs');

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  
  // Viewing Products in Category Modal State
  const [viewingCategory, setViewingCategory] = useState<string | null>(null);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductStock) return;

    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProductName,
      price: parseFloat(newProductPrice),
      category: newProductCategory,
      stock: parseInt(newProductStock),
      unit: newProductUnit
    };

    onAddProduct(product);
    setIsProductModalOpen(false);
    resetProductForm();
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCategory) {
      onEditCategory(editingCategory, categoryName.trim());
    } else {
      onAddCategory(categoryName.trim());
    }
    setCategoryName('');
    setEditingCategory(null);
    setIsCategoryModalOpen(false);
  };

  const resetProductForm = () => {
    setNewProductName('');
    setNewProductPrice('');
    setNewProductCategory(categories[1] || 'General');
    setNewProductStock('');
    setNewProductUnit('pcs');
  };

  const openEditCategory = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (name === 'All') return;
    setEditingCategory(name);
    setCategoryName(name);
    setIsCategoryModalOpen(true);
  };

  const openDeleteCategory = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (name === 'All') return;
    if (confirm(`Sigurado ka bang buburahin ang "${name}"? Mapupunta ang mga produkto nito sa "Uncategorized".`)) {
      onDeleteCategory(name);
    }
  };

  const categoryProducts = viewingCategory 
    ? products.filter(p => viewingCategory === 'All' ? true : p.category === viewingCategory)
    : [];

  return (
    <div className="p-4 space-y-6 animate-fadeIn max-w-lg mx-auto pb-24">
      <header className="flex justify-between items-center pt-2">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Management</h1>
        <button 
          onClick={() => activeTab === 'products' ? setIsProductModalOpen(true) : setIsCategoryModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 transition-all"
        >
          {activeTab === 'products' ? 'Add Product' : 'Add Category'}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 dark:text-slate-500'}`}
        >
          Products
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 dark:text-slate-500'}`}
        >
          Categories
        </button>
      </div>

      {activeTab === 'products' ? (
        <>
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search items..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-11 pr-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-sm transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredProducts.map(p => {
              const isLow = p.stock < 10;
              return (
                <div key={p.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 transition-all hover:border-indigo-100 dark:hover:border-indigo-900">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-black text-slate-800 dark:text-white truncate">{p.name}</h3>
                      {isLow && (
                        <span className="bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Low</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">₱{p.price.toFixed(2)}</span>
                      <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{p.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl">
                    <button 
                      onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 1))}
                      className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 text-slate-400 hover:text-rose-500 active:scale-90 transition-all border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center"
                    >
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <div className="min-w-[3.5rem] text-center">
                      <span className={`text-sm font-black ${isLow ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>
                        {p.stock}
                      </span>
                      <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{p.unit}</p>
                    </div>
                    <button 
                      onClick={() => onUpdateStock(p.id, p.stock + 1)}
                      className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center active:scale-95 transition-all shadow-md shadow-indigo-100 dark:shadow-none"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setViewingCategory(cat)}
              className="w-full bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all text-left"
            >
              <div>
                <span className="text-sm font-black text-slate-800 dark:text-white">{cat}</span>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                  {products.filter(p => cat === 'All' ? true : p.category === cat).length} Products
                </p>
              </div>
              
              <div className="flex gap-2">
                {cat !== 'All' && (
                  <div className="flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => openEditCategory(e, cat)}
                      className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center active:scale-90 shadow-sm"
                    >
                      <i className="fa-solid fa-pen text-[10px]"></i>
                    </button>
                    <button 
                      onClick={(e) => openDeleteCategory(e, cat)}
                      className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 flex items-center justify-center active:scale-90 shadow-sm"
                    >
                      <i className="fa-solid fa-trash text-[10px]"></i>
                    </button>
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-300 flex items-center justify-center">
                  <i className="fa-solid fa-chevron-right text-[10px]"></i>
                </div>
              </div>
            </button>
          ))}
          {categories.length === 1 && (
            <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem]">
              <i className="fa-solid fa-tags text-slate-300 text-3xl mb-3 block"></i>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No categories yet</p>
            </div>
          )}
        </div>
      )}

      {/* Viewing Products in Category Modal */}
      {viewingCategory && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-slate-50 dark:bg-slate-950 w-full max-w-sm rounded-[3rem] animate-bounceIn shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <header className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none mb-1">
                  {viewingCategory}
                </h3>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">List of Items</p>
              </div>
              <button 
                onClick={() => setViewingCategory(null)} 
                className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {categoryProducts.length > 0 ? (
                categoryProducts.map(p => {
                  const isLow = p.stock < 10;
                  return (
                    <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-slate-800 dark:text-white truncate">{p.name}</h4>
                        <p className="text-[10px] font-black text-indigo-500">₱{p.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                        <button 
                          onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 1))}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 text-slate-400 flex items-center justify-center active:scale-90 border border-slate-100 dark:border-slate-700"
                        >
                          <i className="fa-solid fa-minus text-[10px]"></i>
                        </button>
                        <div className="min-w-[2.5rem] text-center">
                          <span className={`text-[12px] font-black ${isLow ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                            {p.stock}
                          </span>
                        </div>
                        <button 
                          onClick={() => onUpdateStock(p.id, p.stock + 1)}
                          className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center active:scale-90"
                        >
                          <i className="fa-solid fa-plus text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-box-open text-slate-300 text-2xl"></i>
                  </div>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Walang Produkto</p>
                  <p className="text-slate-500 text-[10px] mt-1">Magdagdag ng produkto sa category na ito para makita dito.</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setViewingCategory(null)}
                className="w-full bg-slate-900 dark:bg-slate-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
              >
                Isara
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3.5rem] p-8 animate-bounceIn shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
            <header className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">Bagong Paninda</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="w-11 h-11 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </header>
            <form onSubmit={handleAddProductSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Pangalan</label>
                <input type="text" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="e.g. Pancit Canton" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm font-semibold dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Presyo (₱)</label>
                  <input type="number" step="0.01" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm font-semibold dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Stocks</label>
                  <input type="number" value={newProductStock} onChange={(e) => setNewProductStock(e.target.value)} placeholder="0" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm font-semibold dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Category</label>
                  <select value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-4 text-sm font-semibold dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                    {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Unit</label>
                  <input type="text" value={newProductUnit} onChange={(e) => setNewProductUnit(e.target.value)} placeholder="pcs, kg, etc." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm font-semibold dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none transition-all mt-4 active:scale-95">Save Product</button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-8 animate-bounceIn shadow-2xl">
            <header className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">
                {editingCategory ? 'Edit Category' : 'Bagong Category'}
              </h3>
              <button onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); setCategoryName(''); }} className="w-11 h-11 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </header>
            <form onSubmit={handleCategorySubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Pangalan ng Category</label>
                <input 
                  type="text" 
                  value={categoryName} 
                  onChange={(e) => setCategoryName(e.target.value)} 
                  placeholder="e.g. Canned Goods" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm font-semibold dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                  required 
                  autoFocus
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95">
                {editingCategory ? 'Update Category' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
