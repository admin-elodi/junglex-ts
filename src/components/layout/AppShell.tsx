import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import SidePanel from '@components/layout/SidePanel';

import sankofa from '@assets/icons/sankofa.webp';

const AppShell = ({ children }: { children: ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Mobile top bar — only shown below the md breakpoint */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-emerald-700 bg-black/95 sticky top-0 z-30">
        <Link to="/app/dashboard" className="flex items-center gap-2">
          <img src={sankofa} alt="Sankofa" className="w-6 h-6" />
          <Motion.span
            className="text-lg font-bold text-emerald-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            JungleX
          </Motion.span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          className="text-emerald-300 text-2xl leading-none px-2"
        >
          ☰
        </button>
      </div>

      <SidePanel isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="md:ml-64 w-full p-4 md:p-6">
        {children}
      </main>

    </div>
  );
};

export default AppShell;
