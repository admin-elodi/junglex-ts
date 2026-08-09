import { Link } from 'react-router-dom';

const SidePanel = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-black/90 border-r border-emerald-600 p-4">

      <h1 className="text-2xl font-bold text-emerald-400 mb-6">
        JungleX
      </h1>

      <nav className="space-y-3 text-sm">
        <Link to="/app/dashboard">Dashboard</Link>
        <Link to="/app/feed">Feed</Link>
        <Link to="/app/notifications">Notifications</Link>
        <Link to="/app/bookmarks">Bookmarks</Link>
      </nav>

      <div className="mt-8 border-t border-emerald-700 pt-4 text-xs text-gray-400 space-y-2">
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/cookies">Cookies</Link>
      </div>

    </aside>
  );
};

export default SidePanel;