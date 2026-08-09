import { ReactNode, useState } from 'react';
import SidePanel from '@components/layout/SidePanel';

const AppShell = ({ children }: { children: ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Mobile top bar — only shown below the md breakpoint */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-emerald-700 bg-black/95 sticky top-0 z-30">
        <span className="text-lg font-bold text-emerald-400">JungleX</span>
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
