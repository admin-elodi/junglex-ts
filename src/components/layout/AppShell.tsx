import { ReactNode } from 'react';
import SidePanel from '@components/layout/SidePanel';

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-black text-white">

      <SidePanel />

      <main className="ml-64 w-full p-6">
        {children}
      </main>

    </div>
  );
};

export default AppShell;
