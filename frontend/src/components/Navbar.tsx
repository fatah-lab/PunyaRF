import React, { useState } from 'react';
import { 
  Calculator, 
  Map, 
  Coffee, 
  PhoneCall, 
  CreditCard, 
  ReceiptText, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

export type ActiveTab = 'calculator' | 'map' | 'rest_area' | 'emergency' | 'wallet';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenReceipt: () => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReceipt,
  isDark,
  setIsDark,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'calculator' as ActiveTab, label: 'Kalkulator Tarif', icon: Calculator },
    { id: 'map' as ActiveTab, label: 'Peta Interaktif', icon: Map },
    { id: 'rest_area' as ActiveTab, label: 'Rest Area & SPKLU', icon: Coffee },
    { id: 'emergency' as ActiveTab, label: 'Panggilan Darurat', icon: PhoneCall },
    { id: 'wallet' as ActiveTab, label: 'Saldo e-Money', icon: CreditCard },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabClick('calculator')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 text-white shadow-glow-emerald">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  TOLL<span className="text-brand-400">HELPER</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded">
                  ID
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Asisten & Tarif Tol Resmi Indonesia
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Struk & Theme Switcher */}
          <div className="hidden sm:flex items-center space-x-2.5">
            <button
              onClick={onOpenReceipt}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition"
              title="Buat & Cetak Struk Tol"
            >
              <ReceiptText className="w-3.5 h-3.5 text-amber-400" />
              <span>Struk Tol</span>
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition"
              title={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={onOpenReceipt}
              className="p-2 rounded-lg text-amber-400 bg-slate-800/80 border border-slate-700"
              title="Struk Tol"
            >
              <ReceiptText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
