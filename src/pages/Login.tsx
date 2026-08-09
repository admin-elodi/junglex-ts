import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

// 🔥 replace these with your actual assets
import bgImage from '@assets/images/spirit-animals/king.webp';
import sankofa from '@assets/icons/sankofa.webp';

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const { signIn, resendConfirmation } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNeedsConfirmation(false);
    setResendStatus('idle');

    if (!formData.email.includes('@')) {
      setError('Enter a valid email');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password too short');
      return;
    }

    try {
      await signIn({
        email: formData.email,
        password: formData.password,
      });

      navigate('/app/feed');
    } catch (err: any) {
      const message = err.message || 'Invalid email or password';
      setError(message);

      if (message.toLowerCase().includes('email not confirmed')) {
        setNeedsConfirmation(true);
      }
    }
  };

  const handleResend = async () => {
    setResendStatus('sending');
    try {
      await resendConfirmation(formData.email);
      setResendStatus('sent');
    } catch {
      setResendStatus('error');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between items-center px-4 md:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 🔹 HEADER */}
      <Motion.div
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img
          src={sankofa}
          alt="Sankofa"
          className="w-14 h-14 mx-auto mb-2"
        />

        <Motion.h1
          className="text-5xl font-bold text-white drop-shadow-lg mb-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          JungleX
        </Motion.h1>

        <TypeAnimation
          sequence={[
            'Login/signup to JungleX social media',
            2000,
            'Unleash your tribe in the jungle',
            2000,
          ]}
          repeat={Infinity}
          className="text-emerald-300 mt-2"
        />
      </Motion.div>

      {/* 🔹 FORM */}
      <Motion.div
        className="w-full max-w-md bg-black/60 border border-emerald-500 rounded-xl p-8 shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl text-emerald-300 text-center mb-6 font-bold">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-emerald-200 block mb-1">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border border-emerald-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Your email"
            />
          </div>

          <div>
            <label className="text-sm text-emerald-200 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent border border-emerald-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-300"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          {needsConfirmation && (
            <div className="text-center">
              {resendStatus === 'sent' ? (
                <p className="text-emerald-300 text-xs">
                  Confirmation email sent — check your inbox.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendStatus === 'sending'}
                  className="text-emerald-300 text-xs underline hover:text-emerald-100 disabled:opacity-50"
                >
                  {resendStatus === 'sending'
                    ? 'Resending...'
                    : 'Resend confirmation email'}
                </button>
              )}
              {resendStatus === 'error' && (
                <p className="text-red-400 text-xs mt-1">
                  Could not resend — try again in a moment.
                </p>
              )}
            </div>
          )}

          <Motion.button
            type="submit"
            className="w-full py-2 bg-emerald-500 text-black font-bold rounded hover:bg-emerald-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </Motion.button>
        </form>

        <Link
          to="/signup"
          className="block text-center mt-4 text-emerald-300 hover:text-emerald-100"
        >
          Create New Account
        </Link>
      </Motion.div>

      {/* 🔹 FOOTER */}
      <footer className="w-full text-white py-4 bg-black/50 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto px-4">
          
          {/* Links */}
          <div className="flex gap-4 text-sm mb-2 md:mb-0">
            <Link to="/" className="text-emerald-300">Home</Link>
            <Link to="/about" className="text-emerald-300">About</Link>
            <Link to="/contact" className="text-emerald-300">Contact</Link>
          </div>

          {/* Language */}
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-black border border-emerald-500 rounded px-2 py-1 text-sm"
          >
            <option value="en">English</option>
            <option value="yo">Yoruba</option>
            <option value="ig">Igbo</option>
            <option value="ha">Hausa</option>
          </select>

          {/* Copyright */}
          <p className="text-xs text-emerald-200 mt-2 md:mt-0">
            © 2026 JungleX
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
