import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
// requireVerification = true
export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-cream-50">
                <div className="w-12 h-12 border-4 rounded-full border-amber-warm border-t-transparent animate-spin"></div>
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Logged in but not verified (and verification is required)
    // if (requireVerification && !user.is_verified) {
    //     return <Navigate to="/verify-email" replace />;
    // }

    return children;
}
