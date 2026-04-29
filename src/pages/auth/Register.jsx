import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/AuthContext';
import {PageTransition} from '../../components/layout/PageTransition';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword, // 👈 أهم سطر
      });

      navigate('/verify-email');
    } catch (error) {
      console.error(error);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden bg-cream-50 sm:px-6">
        {/* Background decorative elements */}
        <div className="absolute top-[10%] right-[-10%] w-96 h-96 bg-sage-soft/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
        <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 bg-amber-warm/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }} />

        <div className="z-10 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 transition-transform duration-300 transform bg-amber-gradient rounded-3xl shadow-warm -rotate-12 hover:rotate-0">
              <span className="text-3xl font-bold text-white font-display">3E</span>
            </div>
            <h1 className="mb-2 text-4xl font-bold font-display text-memory-text">Join the Class</h1>
            <p className="text-memory-muted">Create an account to start sharing memories.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 glass-panel rounded-3xl"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block mb-2 ml-1 text-sm font-medium text-memory-text">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <FiUser className="text-memory-muted" />
                  </div>
                  <input
                    type="text"
                    {...register('name')}
                    className={`input-field pl-11 ${errors.name ? 'border-memory-danger focus:ring-memory-danger' : ''}`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 ml-1 text-sm text-memory-danger">
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block mb-2 ml-1 text-sm font-medium text-memory-text">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <FiMail className="text-memory-muted" />
                  </div>
                  <input
                    type="email"
                    {...register('email')}
                    className={`input-field pl-11 ${errors.email ? 'border-memory-danger focus:ring-memory-danger' : ''}`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 ml-1 text-sm text-memory-danger">
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block mb-2 ml-1 text-sm font-medium text-memory-text">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <FiLock className="text-memory-muted" />
                  </div>
                  <input
                    type="password"
                    {...register('password')}
                    className={`input-field pl-11 ${errors.password ? 'border-memory-danger focus:ring-memory-danger' : ''}`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 ml-1 text-sm text-memory-danger">
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block mb-2 ml-1 text-sm font-medium text-memory-text">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <FiLock className="text-memory-muted" />
                  </div>
                  <input
                    type="password"
                    {...register('confirmPassword')}
                    className={`input-field pl-11 ${errors.confirmPassword ? 'border-memory-danger focus:ring-memory-danger' : ''}`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 ml-1 text-sm text-memory-danger">
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-lg mt-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-sm text-center text-memory-muted">
              Already a classmate?{' '}
              <Link to="/login" className="font-medium transition-colors text-amber-deep hover:text-amber-warm">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
