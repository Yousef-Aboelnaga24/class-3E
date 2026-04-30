import axios from 'axios';
import toast from 'react-hot-toast';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Accept': 'application/json',
    },
});

// 🔐 Request Interceptor
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// 🔥 Response Interceptor
axiosClient.interceptors.response.use(
    (response) => {
        // ⚡ مهم: بنرجع data مباشرة
        return response.data;
    },
    (error) => {
        const { response } = error;

        if (!response) {
            toast.error('Network error 🌐');
            return Promise.reject(error);
        }

        const { status, data } = response;

        if (status === 401) {
            localStorage.removeItem('auth_token');
            toast.error('Session expired 🔐');

            setTimeout(() => {
                window.location.href = '/login';
            }, 800);
        }

        if (status === 403) {
            toast.error(data.message || 'Access denied');
        }

        if (status === 422) {
            const errors = data.errors;
            if (errors) {
                Object.values(errors).forEach((err) => {
                    toast.error(err[0]);
                });
            }
        }

        if (status === 500) {
            toast.error('Server error ⚠️');
        }

        return Promise.reject(error);
    }
);

export default axiosClient;