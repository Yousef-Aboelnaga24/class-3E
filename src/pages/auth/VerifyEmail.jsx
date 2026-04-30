import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/AuthContext';
import authService from '../../services/authService';
import {PageTransition} from '../../components/layout/PageTransition';

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
        } catch {
            toast.error('Failed to check status.');
        }
    };

    return (
        <PageTransition>
            <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden bg-cream-50">
                <div className="z-10 w-full max-w-md text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 glass-panel rounded-3xl shadow-warm"
                    >
                        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 text-amber-600">
                            <FiMail className="w-10 h-10" />
                        </div>
                        
                        <h1 className="mb-4 text-3xl font-bold font-display text-memory-text">Verify Your Email</h1>
                        <p className="mb-8 text-memory-muted">
                            We've sent a verification link to <span className="font-semibold text-memory-text">{user?.email}</span>. 
                            Please click the link in the email to verify your account.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={handleCheckStatus}
                                className="flex items-center justify-center w-full gap-2 py-3 btn-primary"
                            >
                                <span>I've Verified My Email</span>
                            </button>

                            <button
                                onClick={handleResend}
                                disabled={isResending}
                                className="flex items-center justify-center w-full gap-2 py-3 font-medium transition-colors text-amber-deep hover:text-amber-warm"
                            >
                                {isResending ? (
                                    <FiRefreshCw className="animate-spin" />
                                ) : (
                                    <FiRefreshCw />
                                )}
                                <span>Resend Verification Link</span>
                            </button>
                        </div>

                        <div className="pt-6 mt-8 border-t border-memory-border">
                            <button
                                onClick={logout}
                                className="flex items-center justify-center gap-2 mx-auto transition-colors text-memory-muted hover:text-memory-text"
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
