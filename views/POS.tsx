
import React, { useState } from 'react';
import { Product, TransactionItem } from '../types';
import ScannerOverlay from '../components/ScannerOverlay';

interface POSProps {
  products: Product[];
  categories: string[];
  onCompleteSale: (items: TransactionItem[], paymentMethod: 'cash' | 'digital') => void;
}

const POS: React.FC<POSProps> = ({ products, categories, onCompleteSale }) => {
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [showScanner, setShowScanner] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const filteredProducts = products.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return;
      setCart(cart.map(item => 
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, quantity: 1, price: product.price }]);
    }
  };

  const handleScanSuccess = (result: string) => {
    setShowScanner(false);
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    if (randomProduct) addToCart(randomProduct);
  };

  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const handleComplete = (method: 'cash' | 'digital') => {
    if (method === 'digital') {
      setShowQRModal(true);
    } else {
      finalizeSale('cash');
    }
  };

  const finalizeSale = (method: 'cash' | 'digital') => {
    onCompleteSale(cart, method);
    setCheckoutStep('success');
    setCart([]);
    setShowQRModal(false);
    setTimeout(() => setCheckoutStep('cart'), 2000);
  };

  if (checkoutStep === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-8 animate-bounceIn bg-white dark:bg-slate-950">
        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-5xl mb-6 shadow-xl shadow-emerald-100">
          <i className="fa-solid fa-check-double"></i>
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight text-center">Sale Success!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mt-2 font-medium">Recorded transaction and updated stocks.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 max-w-full overflow-hidden">
      {/* Sticky Header */}
      <div className="p-4 space-y-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 shadow-sm w-full">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search paninda..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-10 pr-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowScanner(true)}
            className="bg-indigo-600 hover:bg-indigo-700 w-11 h-11 rounded-2xl text-white flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 transition-all flex-shrink-0"
          >
            <i className="fa-solid fa-barcode"></i>
          </button>
        </div>

        {/* Constrained Horizontal Filter Scroll with Masking */}
        <div className="relative -mx-4">
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-xl text-[11px] font-black transition-all flex-shrink-0 border-2 ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 dark:shadow-none' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-64 no-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => {
            const inCart = cart.find(c => c.productId === product.id)?.quantity || 0;
            const isLow = product.stock <= 5;
            const isOut = product.stock <= 0;
            
            return (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={isOut}
                className={`bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-left relative active:scale-95 transition-all shadow-sm flex flex-col justify-between min-h-[140px] group ${isOut ? 'opacity-40 grayscale' : 'hover:border-indigo-200 dark:hover:border-indigo-800'}`}
              >
                {inCart > 0 && (
                  <div className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 animate-bounceIn z-10">
                    {inCart}
                  </div>
                )}
                
                <div>
                  <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 mb-1.5 uppercase tracking-wide">₱{product.price.toFixed(2)}</div>
                  <div className="text-[13px] font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug h-[2.8em]">{product.name}</div>
                </div>
                
                <div className="mt-3">
                  <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg w-fit transition-colors ${
                    isOut ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600' : 
                    isLow ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-500' : 
                    'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'
                  }`}>
                    {isOut ? 'SOLD OUT' : `${product.stock} ${product.unit}`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-[80px] left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-5 shadow-[0_-20px_50px_rgba(0,0,0,0.12)] rounded-t-[3rem] animate-slideUp z-40 max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-5 px-1">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Subtotal</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white">₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-tight">
                {cart.reduce((a, b) => a + b.quantity, 0)} Items
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleComplete('cash')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-100 dark:shadow-none active:scale-95 transition-all text-[10px] uppercase tracking-widest"
            >
              <i className="fa-solid fa-coins text-lg"></i>
              Cash
            </button>
            <button
              onClick={() => handleComplete('digital')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black flex flex-col items-center justify-center gap-1 shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 transition-all text-[10px] uppercase tracking-widest"
            >
              <i className="fa-solid fa-qrcode text-lg"></i>
              Digital
            </button>
          </div>
          
          <button 
            onClick={() => setCart([])}
            className="w-full mt-4 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] py-2 active:text-rose-500"
          >
            Reset
          </button>
        </div>
      )}

      {/* Digital Payment Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-8 text-center relative animate-bounceIn shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1 uppercase tracking-tight">Online Payment</h3>
            <p className="text-indigo-600 dark:text-indigo-400 text-sm font-black tracking-[0.1em] mb-6">TOTAL: ₱{total.toFixed(2)}</p>
            
            <div className="bg-white p-5 rounded-[2.5rem] border-4 border-indigo-600 inline-block mb-6 shadow-xl shadow-indigo-100">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=SariSariPay_Payment_${total}`} 
                alt="Payment QR" 
                className="w-48 h-48 mx-auto"
              />
            </div>
            
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-8 px-4 leading-relaxed">
              Customer can scan this with <span className="text-indigo-600 font-black">GCash</span> or <span className="text-indigo-600 font-black">Maya</span> to pay instantly.
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => finalizeSale('digital')}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 dark:shadow-none"
              >
                Confirm Paid
              </button>
              <button 
                onClick={() => setShowQRModal(false)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-400 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {showScanner && <ScannerOverlay onClose={() => setShowScanner(false)} onScan={handleScanSuccess} />}
    </div>
  );
};

export default POS;
