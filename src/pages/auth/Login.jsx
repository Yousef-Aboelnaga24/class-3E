import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/AuthContext';
import PageTransition from '../../components/layout/PageTransition';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data);
      // Success toast is in AuthContext
      navigate(from, { replace: true });
    } catch (error) {
      if (error.response?.status === 403) {
        navigate('/verify-email');
      }
      // Generic error toast is in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-cream-50 relative overflow-hidden px-4 sm:px-6">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-warm/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sky-soft/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '1s' }} />

        <div className="w-full max-w-md z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto bg-amber-gradient rounded-3xl shadow-warm flex items-center justify-center mb-6 transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <span className="text-white font-display font-bold text-3xl">3E</span>
            </div>
            <h1 className="text-4xl font-display font-bold text-memory-text mb-2">Welcome Back</h1>
            <p className="text-memory-muted">Relive the beautiful moments we shared.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel rounded-3xl p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-memory-text mb-2 ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm text-memory-danger ml-1">
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-memory-text mb-2 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm text-memory-danger ml-1">
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <div className="flex items-center justify-between ml-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-amber-warm focus:ring-amber-warm border-memory-border rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-memory-muted">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-amber-deep hover:text-amber-warm transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-lg"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-memory-muted">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-medium text-amber-deep hover:text-amber-warm transition-colors">
                Join the class
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
