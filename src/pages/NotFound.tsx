import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center">
      <h1 className="text-5xl font-bold text-emerald-400 mb-3">404</h1>
      <p className="text-gray-400 mb-6">This path doesn't exist in the jungle.</p>
      <Link to="/" className="bg-emerald-500 text-black font-bold px-5 py-2 rounded hover:bg-emerald-600">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
