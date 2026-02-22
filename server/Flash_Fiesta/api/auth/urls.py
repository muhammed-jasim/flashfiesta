from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('profile/', views.get_user_profile, name='profile'),
    path('profile/update/', views.update_user_profile, name='update_profile'),
    path('employees/', views.list_employees, name='list_employees'),
    path('employees/update-permissions/<int:pk>/', views.update_employee_permissions, name='update_employee_permissions'),
]
