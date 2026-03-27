
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Transaction } from '../types';

interface ReportsProps {
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  const isDark = document.documentElement.classList.contains('dark');

  // Aggregate sales by hour for a "Today" view
  const hourlyData = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // 8 AM to 7 PM
    const total = transactions
      .filter(t => new Date(t.timestamp).getHours() === hour)
      .reduce((acc, curr) => acc + curr.total, 0);
    return { hour: `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'p' : 'a'}`, total };
  });

  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.total, 0);
  const digitalCount = transactions.filter(t => t.paymentMethod === 'digital').length;
  const cashCount = transactions.filter(t => t.paymentMethod === 'cash').length;

  return (
    <div className="p-4 space-y-6 pb-24 animate-fadeIn max-w-lg mx-auto">
      <header className="pt-2">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Performance</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Benta at Kita Reports</p>
      </header>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-8 px-1">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Hourly Sales</h3>
          <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full">+12% vs kahapon</div>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <XAxis 
                dataKey="hour" 
                fontSize={9} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontWeight: 700 }} 
              />
              <Tooltip 
                cursor={{fill: isDark ? '#1e293b' : '#f8fafc'}}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {hourlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.total > 0 ? (isDark ? '#818cf8' : '#4f46e5') : (isDark ? '#1e293b' : '#f1f5f9')} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
            <i className="fa-solid fa-wallet text-sm"></i>
          </div>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">CASH SALES</p>
          <p className="text-xl font-black text-slate-800 dark:text-white">{cashCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-xl flex items-center justify-center mb-3">
            <i className="fa-solid fa-mobile-screen-button text-sm"></i>
          </div>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">DIGITAL SALES</p>
          <p className="text-xl font-black text-slate-800 dark:text-white">{digitalCount}</p>
        </div>
      </div>

      <section className="bg-indigo-600 dark:bg-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 dark:shadow-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 blur-3xl"></div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[9px] opacity-70 font-black uppercase tracking-[0.2em] mb-1">Creditworthiness</p>
            <p className="text-3xl font-black">784</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <i className="fa-solid fa-shield-check text-xl"></i>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 w-[78%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
          </div>
          <p className="text-[11px] font-medium opacity-90 leading-relaxed">
            Dahil sa maayos mong pag-record, qualified ka para sa <span className="font-black underline underline-offset-4 decoration-emerald-400">₱10,000 micro-loan</span> para pandagdag sa paninda!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Reports;
