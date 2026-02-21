import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is invalid or expired
            localStorage.clear();
            window.location.href = '/'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
