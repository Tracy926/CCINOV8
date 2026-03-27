import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navItems = [
    { to: '/', icon: 'fa-house', label: 'Home' },
    { to: '/pos', icon: 'fa-calculator', label: 'POS' },
    { to: '/inventory', icon: 'fa-boxes-stacked', label: 'Stock' },
    { to: '/reports', icon: 'fa-chart-line', label: 'Reports' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-3 flex justify-around items-center z-50 pb-[env(safe-area-inset-bottom,16px)] shadow-[0_-2px_15px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all active:scale-90 ${
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
            }`
          }
        >
          <div className={`p-1.5 rounded-xl transition-colors ${item.to === window.location.hash.slice(1) ? 'bg-indigo-50 dark:bg-indigo-950/30' : ''}`}>
             <i className={`fa-solid ${item.icon} text-lg`}></i>
          </div>
          <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;