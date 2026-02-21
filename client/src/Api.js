const BASE_URL = 'http://localhost:8000';

export const ProductDeatailsApi = `${BASE_URL}/api/product/Products`;
export const ProductDetailApi = (id) => `${BASE_URL}/api/product/Products/${id}/`;
export const CreteProduct = `${BASE_URL}/api/product/CreateProducts/`;
export const RegisterApi = `${BASE_URL}/api/auth/register/`;
export const LoginApi = `${BASE_URL}/api/auth/login/`;
export const ProfileApi = `${BASE_URL}/api/auth/profile/`;
export const UpdateProfileApi = `${BASE_URL}/api/auth/profile/update/`;

// Category & Review APIs
export const CategoriesApi = `${BASE_URL}/api/product/Categories/`;
export const CreateCategoryApi = `${BASE_URL}/api/product/CreateCategory/`;
export const CreateReviewApi = `${BASE_URL}/api/product/CreateReview/`;

// Order APIs
export const PlaceOrderApi = `${BASE_URL}/api/order/place/`;
export const MyOrdersApi = `${BASE_URL}/api/order/my-orders/`;
export const DashboardStatsApi = `${BASE_URL}/api/order/dashboard-stats/`;
export const GetAllOrdersApi = `${BASE_URL}/api/order/all/`;
export const UpdateOrderStatusApi = (id) => `${BASE_URL}/api/order/update-status/${id}/`;
export const OrderDetailApi = (id) => `${BASE_URL}/api/order/detail/${id}/`;
