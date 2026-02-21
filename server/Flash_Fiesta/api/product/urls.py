from django.urls import path
from Flash_Fiesta.api.product import views

urlpatterns = [
    path('Products/', views.ProductView, name='ProductDetails'),
    path('Products/<uuid:pk>/', views.ProductDetailView, name='ProductDetail'),
    path('CreateProducts/', views.Create_Product, name='CreateProduct'),
    path('Categories/', views.List_Categories, name='ListCategories'),
    path('CreateCategory/', views.Create_Category, name='CreateCategory'),
    path('CreateReview/', views.Create_Review, name='CreateReview'),
]