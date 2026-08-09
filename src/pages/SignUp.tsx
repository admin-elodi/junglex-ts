import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

import SpiritAnimalModal from '@components/auth/SpiritAnimalModal';

import bg from '@assets/images/spirit-animals/sunset.webp';
import sankofa from '@assets/icons/sankofa.webp';

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  spiritAnimal: string;
};

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    spiritAnimal: '',
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { username, email, password, confirmPassword, spiritAnimal } = form;

    // 🔒 Validation
    if (username.length < 3) return setError('Username too short');
    if (!email.includes('@')) return setError('Invalid email');
    if (password.length < 6) return setError('Password too short');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (!spiritAnimal) return setError('Choose your spirit animal');

    try {
      setLoading(true);

      await signUp({
        email,
        password,
        username,
        spiritAnimal,
      });

      // 🔥 success → go to dashboard (or verification page later)
      navigate('/app/feed');

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 🔥 HEADER */}
      <div className="text-center mt-10">
        <img src={sankofa} alt="Sankofa symbol" className="w-14 h-14 mx-auto" />

        <Motion.h1
          className="text-5xl font-bold text-white"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          JungleX
        </Motion.h1>

        <TypeAnimation
          sequence={[
            'Join the Tribe',
            2000,
            'Choose Your Spirit',
            2000,
            'Enter the Jungle',
            2000,
          ]}
          repeat={Infinity}
          className="text-emerald-300 mt-2"
        />
      </div>

      {/* 🔥 FORM */}
      <Motion.div
        className="w-full max-w-md bg-black/60 border border-emerald-500 p-6 rounded-xl mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl text-emerald-300 text-center mb-4">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm text-emerald-200 block mb-1">
              Username
            </label>
            <input
              name="username"
              placeholder="Your username"
              onChange={handleChange}
              className="w-full p-2 rounded border-2 border-emerald-500 bg-black/30 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="text-sm text-emerald-200 block mb-1">
              Email
            </label>
            <input
              name="email"
              placeholder="Your email"
              onChange={handleChange}
              className="w-full p-2 rounded border-2 border-emerald-500 bg-black/30 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* 🔐 PASSWORD */}
          <div>
            <label className="text-sm text-emerald-200 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                onChange={handleChange}
                className="w-full p-2 rounded border-2 border-emerald-500 bg-black/30 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-2 top-2 text-xs text-emerald-300"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* 🔐 CONFIRM PASSWORD */}
          <div>
            <label className="text-sm text-emerald-200 block mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm your password"
                onChange={handleChange}
                className="w-full p-2 rounded border-2 border-emerald-500 bg-black/30 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-2 top-2 text-xs text-emerald-300"
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* 🐾 SPIRIT ANIMAL */}
          <div className="text-center">
            <p className="text-emerald-300 text-sm mb-2">
              Spirit Animal
            </p>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="border-2 border-emerald-500 rounded px-4 py-2 text-white w-full bg-black/30"
            >
              {form.spiritAnimal || 'Select Your Animal'}
            </button>
          </div>

          {/* ❌ ERROR */}
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          {/* 🚀 SUBMIT */}
          <Motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-emerald-500 text-black py-2 font-bold disabled:opacity-50"
          >
            {loading ? 'Entering the Jungle...' : 'Enter the Jungle'}
          </Motion.button>
        </form>

        <Link
          to="/"
          className="block text-center mt-4 text-emerald-300"
        >
          Already have an account?
        </Link>
      </Motion.div>

      {/* 🐾 MODAL */}
      <SpiritAnimalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedAnimal={form.spiritAnimal}
        onSelect={(animal) =>
          setForm((prev) => ({ ...prev, spiritAnimal: animal }))
        }
      />
    </div>
  );
};

export default SignUp;
