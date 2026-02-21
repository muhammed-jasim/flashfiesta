from rest_framework import serializers
from store.models import Product, ProductImageGallery, Category, Review
from django.contrib.auth.models import User

class UserBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    user = UserBriefSerializer(read_only=True)
    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']

class ProductImageGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImageGallery
        fields = ['id', 'image']

class ProductSerializer(serializers.ModelSerializer):
    gallery = ProductImageGallerySerializer(many=True, read_only=True)
    category_details = CategorySerializer(source='category', read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    Rate = serializers.ReadOnlyField(source='ProductPrice')
    Qty = serializers.ReadOnlyField(source='ProductQuantity')
    can_review = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'ProductID', 'ProductName', 'ProductDescription', 
            'ProductPrice', 'ProductQuantity', 'ProductImage', 
            'Rate', 'Qty', 'gallery', 'category', 'category_details', 
            'is_trending', 'reviews', 'can_review'
        ]

    def get_can_review(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from store.models import OrderItem
            return OrderItem.objects.filter(
                order__user=request.user, 
                product=obj, 
                order__status='Delivered'
            ).exists()
        return False