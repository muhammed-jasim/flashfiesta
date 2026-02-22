from django.contrib import admin
from .models import Product, ProductImageGallery, Order, OrderItem, Category, Review, DashBoardSwiper, UserProfile

admin.site.register(Product)
admin.site.register(ProductImageGallery)
admin.site.register(Category)
admin.site.register(Review)
admin.site.register(DashBoardSwiper)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role']
    list_filter = ['role']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'total_amount', 'status', 'created_at']
    inlines = [OrderItemInline]
