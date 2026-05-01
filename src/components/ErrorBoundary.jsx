import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cream-50 to-amber-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="max-w-md w-full mx-4 p-8 bg-white rounded-3xl shadow-lg border border-memory-border"
                    >
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-memory-danger/10">
                            <FiAlertTriangle className="w-8 h-8 text-memory-danger" />
                        </div>

                        <h1 className="text-2xl font-bold text-center text-memory-text mb-2">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-center text-memory-muted mb-6">
                            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
                        </p>

                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
                                <p className="text-xs text-red-700 font-mono break-words">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={this.resetError}
                            className="w-full flex items-center justify-center gap-2 btn-primary"
                        >
                            <FiRefreshCw className="w-5 h-5" />
                            Try Again
                        </motion.button>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
