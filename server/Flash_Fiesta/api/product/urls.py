from django.urls import path
from Flash_Fiesta.api.product import views

urlpatterns = [
    path('Products/', views.ProductView, name='ProductDetails'),
    path('Products/<uuid:pk>/', views.ProductDetailView, name='ProductDetail'),
    path('CreateProducts/', views.Create_Product, name='CreateProduct'),
    path('Categories/', views.List_Categories, name='ListCategories'),
    path('CreateCategory/', views.Create_Category, name='CreateCategory'),
    path('CreateReview/', views.Create_Review, name='CreateReview'),
    path('SearchSuggestions/', views.Search_Suggestions, name='SearchSuggestions'),
    path('Wishlist/Toggle/', views.Toggle_Wishlist, name='ToggleWishlist'),
    path('Wishlist/', views.List_Wishlist, name='ListWishlist'),
    path('UpdateProduct/<uuid:pk>/', views.Update_Product, name='UpdateProduct'),
    path('DeleteProduct/<uuid:pk>/', views.Delete_Product, name='DeleteProduct'),
    path('Cart/Sync/', views.Sync_Cart, name='SyncCart'),
    path('Cart/', views.Get_Cart, name='GetCart'),
]