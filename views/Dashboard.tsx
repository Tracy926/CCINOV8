
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction, Product } from '../types';
import ScannerOverlay from '../components/ScannerOverlay';

interface DashboardProps {
  transactions: Transaction[];
  products: Product[];
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, products, toggleTheme, isDarkMode }) => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [showStoreQR, setShowStoreQR] = useState(false);
  
  const today = new Date().toDateString();
  const todayTransactions = transactions.filter(t => new Date(t.timestamp).toDateString() === today);
  const totalSales = todayTransactions.reduce((acc, curr) => acc + curr.total, 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="p-4 space-y-6 animate-fadeIn max-w-lg mx-auto pb-24">
      <header className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <i className="fa-solid fa-store text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Aling Nena's Store</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">SariSariPay Verified</p>
          </div>
        </div>
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
        >
          <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-600'}`}></i>
        </button>
      </header>

      {/* Sales Summary Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-[10px] opacity-80 uppercase font-black tracking-[0.2em] mb-1">Today's Revenue</p>
            <p className="text-4xl font-black">₱{totalSales.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl">
            <i className="fa-solid fa-chart-line text-xl"></i>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-[10px] font-bold">
          <div className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
            <i className="fa-solid fa-receipt opacity-60"></i>
            {todayTransactions.length} Sales
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
            <i className="fa-solid fa-box-open opacity-60"></i>
            {lowStockCount} Low Stocks
          </div>
        </div>
      </div>

      {/* Main Grid Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => navigate('/pos')}
          className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all group"
        >
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-100 transition-colors">
            <i className="fa-solid fa-plus"></i>
          </div>
          <span className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-widest">New Sale</span>
        </button>

        <button 
          onClick={() => setShowScanner(true)}
          className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all group"
        >
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-100 transition-colors">
            <i className="fa-solid fa-barcode"></i>
          </div>
          <span className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-widest">Scanner</span>
        </button>

        <button 
          onClick={() => setShowStoreQR(true)}
          className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all group"
        >
          <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-purple-100 transition-colors">
            <i className="fa-solid fa-qrcode"></i>
          </div>
          <span className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-widest">Store QR</span>
        </button>

        <button 
          onClick={() => navigate('/inventory')}
          className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all group"
        >
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-amber-100 transition-colors">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <span className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-widest">Inventory</span>
        </button>
      </div>

      {/* Store QR Modal Simulation */}
      {showStoreQR && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-8 text-center relative animate-bounceIn">
            <button onClick={() => setShowStoreQR(false)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">SariSariPay QR</h3>
            <p className="text-slate-500 text-sm mb-6">Let customers scan this to pay Aling Nena's Store</p>
            <div className="bg-white p-6 rounded-[2rem] border-4 border-indigo-600 inline-block mb-6 shadow-xl shadow-indigo-100">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SariSariPay_Aling_Nena" 
                alt="Store QR" 
                className="w-48 h-48 mx-auto"
              />
            </div>
            <div className="flex gap-2 justify-center">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase">QRPh Ready</span>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase">Verified</span>
            </div>
          </div>
        </div>
      )}

      {showScanner && <ScannerOverlay onClose={() => setShowScanner(false)} onScan={(res) => {
        setShowScanner(false);
        navigate('/pos');
      }} />}
    </div>
  );
};

export default Dashboard;
