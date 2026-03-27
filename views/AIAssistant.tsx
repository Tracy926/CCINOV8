
import React, { useState, useEffect } from 'react';
import { Product, Transaction, BusinessInsight } from '../types';
import { getBusinessInsights } from '../services/geminiService';

interface AIAssistantProps {
  products: Product[];
  transactions: Transaction[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ products, transactions }) => {
  const [insight, setInsight] = useState<BusinessInsight | null>(() => {
    const saved = localStorage.getItem('sarisaripay_last_insight');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const data = await getBusinessInsights(products, transactions);
    setInsight(data);
    localStorage.setItem('sarisaripay_last_insight', JSON.stringify(data));
    setLoading(false);
  };

  useEffect(() => {
    if (!insight) fetchInsights();
  }, []);

  return (
    <div className="p-4 space-y-8 animate-fadeIn pb-24 max-w-lg mx-auto">
      <header className="text-center pt-4">
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-700 rounded-[2rem] flex items-center justify-center text-white text-4xl mx-auto shadow-2xl shadow-indigo-200 dark:shadow-none mb-6 relative z-10 animate-pulse">
            <i className="fa-solid fa-brain"></i>
          </div>
          <div className="absolute top-0 left-0 w-20 h-20 bg-indigo-400 blur-2xl opacity-20 animate-pulse"></div>
        </div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Negosyo Assistant</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Smart tips for your sari-sari store</p>
      </header>

      {loading ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <div className="flex justify-center gap-1 mb-4">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Pinag-aaralan ang iyong benta...</p>
          </div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-950/20 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
              <h2 className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Market Report</h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold italic text-sm">
              "{insight?.summary || "Ready to analyze your store performance. Tap refresh below!"}"
            </p>
          </div>

          <section>
            <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 px-1">Top Suggestions</h2>
            <div className="space-y-4">
              {insight?.recommendations.map((rec, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex gap-5 group active:bg-slate-50 transition-colors">
                  <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-sm font-black ${
                    i === 0 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30' : 
                    i === 1 ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30' : 
                    'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30'
                  }`}>
                    {i + 1}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-bold leading-relaxed self-center">{rec}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-4">
            <button 
              onClick={fetchInsights}
              className="w-full bg-slate-900 dark:bg-slate-800 text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 dark:shadow-none text-xs tracking-widest uppercase"
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              Get Smart Advice
            </button>
            <p className="text-center text-[9px] text-slate-400 mt-4 uppercase font-black tracking-widest">Powered by Gemini AI</p>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
