import axios from 'axios';

// Function to get the access token
function getAccessToken(): string | null {
    return localStorage.getItem("ACCESS_TOKEN");
}

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
    (request) => {
        const token = getAccessToken();
        if (token) {
            request.headers['Authorization'] = `Bearer ${token}`;
        }
        return request;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle responses and errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const UNAUTHORIZED_PATHS = ['/signin', '/signup'];
        if (error.response?.status === 403 && !UNAUTHORIZED_PATHS.includes(window.location.pathname)) {
            localStorage.removeItem('ACCESS_TOKEN');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;