import axios from 'axios';

// Create a robust axios instance
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request Interceptor: Pass the token automatically
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;

        // Skip redirect logic for Login and Register endpoints to avoid reload loops
        const isAuthRequest = originalRequest.url.includes('/login/') || originalRequest.url.includes('/register/');

        if (error.response && error.response.status === 401 && !isAuthRequest) {
            // Token is invalid/expired - Clear local storage and redirect
            localStorage.clear();

            // Only redirect if we aren't already on the login page
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
