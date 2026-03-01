const BASE_URL = 'http://localhost:8000';

export const ProductDeatailsApi = `${BASE_URL}/api/product/Products/`;
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
export const SearchSuggestionsApi = `${BASE_URL}/api/product/SearchSuggestions/`;
export const ToggleWishlistApi = `${BASE_URL}/api/product/Wishlist/Toggle/`;
export const ListWishlistApi = `${BASE_URL}/api/product/Wishlist/`;

// Order APIs
export const PlaceOrderApi = `${BASE_URL}/api/order/place/`;
export const MyOrdersApi = `${BASE_URL}/api/order/my-orders/`;
export const DashboardStatsApi = `${BASE_URL}/api/order/dashboard-stats/`;
export const GetAllOrdersApi = `${BASE_URL}/api/order/all/`;
export const UpdateOrderStatusApi = (id) => `${BASE_URL}/api/order/update-status/${id}/`;
export const OrderDetailApi = (id) => `${BASE_URL}/api/order/detail/${id}/`;
export const SyncCartApi = `${BASE_URL}/api/product/Cart/Sync/`;
export const GetCartApi = `${BASE_URL}/api/product/Cart/`;
export const UpdateProductApi = (id) => `${BASE_URL}/api/product/UpdateProduct/${id}/`;
export const DeleteProductApi = (id) => `${BASE_URL}/api/product/DeleteProduct/${id}/`;
export const UpdateCategoryApi = (id) => `${BASE_URL}/api/product/UpdateCategory/${id}/`;
export const DeleteCategoryApi = (id) => `${BASE_URL}/api/product/DeleteCategory/${id}/`;
export const ListEmployeesApi = `${BASE_URL}/api/auth/employees/`;
export const UpdateEmployeePermissionsApi = (id) => `${BASE_URL}/api/auth/employees/update-permissions/${id}/`;
