from django.contrib import admin
from django.urls import path,include
from Flash_Fiesta.api.product import views

urlpatterns = [
    path('Products/',views.ProductView, name='ProductDetails'),
    path('Products/<int:pk>/',views.ProductDetailView, name='ProductDetail'),
    path('CreateProducts/',views.Create_Product, name='CreateProduct'),
]