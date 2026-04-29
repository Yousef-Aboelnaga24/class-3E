import axios from 'axios';
import toast from 'react-hot-toast';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// 🔐 Request Interceptor
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 🔥 Response Interceptor
axiosClient.interceptors.response.use(
    (response) => {
        // 👑 Normalize response
        return response.data;
    },
    (error) => {
        const { response } = error;

        if (!response) {
            toast.error('Network error 🌐');
            return Promise.reject(error);
        }

        const { status, data } = response;

        // 🔐 401 Unauthorized
        if (status === 401) {
            localStorage.removeItem('auth_token');
            toast.error('Session expired, please login again 🔐');

            // redirect safely
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }

        // 🚫 403 Forbidden (Email not verified)
        if (status === 403) {
            toast.error(data.message || 'Access denied');
        }

        // ❌ 422 Validation
        if (status === 422) {
            const errors = data.errors;

            if (errors) {
                Object.values(errors).forEach((err) => {
                    toast.error(err[0]);
                });
            }
        }

        // 💥 500 Server Error
        if (status === 500) {
            toast.error('Server error ⚠️');
        }

        return Promise.reject(error);
    }
);

export default axiosClient;