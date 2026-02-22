from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role', read_only=True)
    phone_number = serializers.CharField(source='profile.phone_number', required=False)
    address = serializers.CharField(source='profile.address', required=False)
    city = serializers.CharField(source='profile.city', required=False)
    zip_code = serializers.CharField(source='profile.zip_code', required=False)
    
    can_view_stats = serializers.BooleanField(source='profile.can_view_stats', read_only=True)
    can_manage_products = serializers.BooleanField(source='profile.can_manage_products', read_only=True)
    can_manage_categories = serializers.BooleanField(source='profile.can_manage_categories', read_only=True)
    can_manage_orders = serializers.BooleanField(source='profile.can_manage_orders', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'phone_number', 'address', 'city', 'zip_code', 'can_view_stats', 'can_manage_products', 'can_manage_categories', 'can_manage_orders']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        from store.models import UserProfile
        profile_data = validated_data.pop('profile', {})
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(
            user=user, 
            role='CUSTOMER',
            **profile_data
        )
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Update profile fields
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance
