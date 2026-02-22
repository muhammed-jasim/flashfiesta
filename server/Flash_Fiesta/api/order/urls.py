from django.urls import path
from . import views

urlpatterns = [
    path('place/', views.place_order, name='place_order'),
    path('my-orders/', views.get_user_orders, name='user_orders'),
    path('dashboard-stats/', views.get_dashboard_stats, name='dashboard_stats'),
    path('all/', views.get_all_orders, name='all_orders'),
    path('update-status/<uuid:pk>/', views.update_order_status, name='update_status'),
    path('detail/<uuid:pk>/', views.get_order_detail, name='order_detail'),
]
