import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/AuthContext';
import authService from '../../services/authService';
import PageTransition from '../../components/layout/PageTransition';

export default function VerifyEmail() {
    const [isResending, setIsResending] = useState(false);
    const { user, logout, setUser } = useAuth();
    const navigate = useNavigate();

    const handleResend = async () => {
        setIsResending(true);
        try {
            await authService.resendVerification();
            toast.success('Verification link resent to your email.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend verification link.');
        } finally {
            setIsResending(false);
        }
    };

    const handleCheckStatus = async () => {
        try {
            const response = await authService.getCurrentUser();
            const userData = response.data || response;
            if (userData.is_verified) {
                setUser(userData);
                toast.success('Email verified! Welcome to the class.');
                navigate('/');
            } else {
                toast.error('Email not verified yet. Please check your inbox.');
            }
        } catch (error) {
            toast.error('Failed to check status.');
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen flex items-center justify-center bg-cream-50 relative overflow-hidden px-4">
                <div className="w-full max-w-md z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel rounded-3xl p-8 shadow-warm"
                    >
                        <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-600">
                            <FiMail className="w-10 h-10" />
                        </div>
                        
                        <h1 className="text-3xl font-display font-bold text-memory-text mb-4">Verify Your Email</h1>
                        <p className="text-memory-muted mb-8">
                            We've sent a verification link to <span className="font-semibold text-memory-text">{user?.email}</span>. 
                            Please click the link in the email to verify your account.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={handleCheckStatus}
                                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                            >
                                <span>I've Verified My Email</span>
                            </button>

                            <button
                                onClick={handleResend}
                                disabled={isResending}
                                className="w-full py-3 text-amber-deep font-medium hover:text-amber-warm transition-colors flex items-center justify-center gap-2"
                            >
                                {isResending ? (
                                    <FiRefreshCw className="animate-spin" />
                                ) : (
                                    <FiRefreshCw />
                                )}
                                <span>Resend Verification Link</span>
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-memory-border">
                            <button
                                onClick={logout}
                                className="text-memory-muted hover:text-memory-text transition-colors flex items-center justify-center gap-2 mx-auto"
                            >
                                <FiArrowLeft />
                                <span>Back to Login</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
