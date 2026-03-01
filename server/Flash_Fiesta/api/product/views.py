from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from store.models import Product, ProductImageGallery, Category, Review, OrderItem, Order, CartItem
from .serializers import ProductSerializer, CategorySerializer, ReviewSerializer, CartItemSerializer

@api_view(["GET"])
def ProductView(request):
    try:
        search_query = request.GET.get('search')
        category_id = request.GET.get('category')
        trending = request.GET.get('trending')
        
        products = Product.objects.all()
        
        if search_query:
            products = products.filter(ProductName__icontains=search_query)
        if category_id:
            products = products.filter(category_id=category_id)
        if trending == 'true':
            products = products.filter(is_trending=True)
            
        serializer = ProductSerializer(products, many=True, context={'request': request})
        response_data = {'Status': 6000, 'data': serializer.data}
    except Exception as e:
        print(f"Error fetching product details: {e}")
        response_data = {'Status': 6001, 'data': []}

    return Response(response_data, status=status.HTTP_200_OK)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def Create_Product(request):
    profile = request.user.profile
    if profile.role != 'OWNER' and not profile.can_manage_products:
        return Response({'Status': 6001, 'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    try:
        ProductName = request.data.get('ProductName')
        Description = request.data.get('Description', '')
        ProductImage = request.FILES.get('ProductImage')
        gallery_images = request.FILES.getlist('gallery_images')
        Qty = request.data.get('Qty', 0)
        Rate = request.data.get('Rate', 0)
        category_id = request.data.get('category')
        is_trending = request.data.get('is_trending') == 'true'

        if category_id and category_id != '' and category_id != 'null':
            id_cat = category_id
        else:
            id_cat = None

        if ProductName:
            product = Product.objects.create(
                ProductName=ProductName,
                ProductDescription=Description,
                ProductImage=ProductImage,
                ProductQuantity=Qty,
                ProductPrice=Rate,
                category_id=id_cat,
                is_trending=is_trending
            )
            
            for img in gallery_images:
                ProductImageGallery.objects.create(product=product, image=img)
                
            return Response({'Status': 6000, 'data': 'Product created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'Status': 6001, 'data': 'Provide valid data'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'Status': 6001, 'data': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def Update_Product(request, pk):
    profile = request.user.profile
    if profile.role != 'OWNER' and not profile.can_manage_products:
        return Response({'Status': 6001, 'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    try:
        product = Product.objects.get(pk=pk)
        data = request.data
        product.ProductName = data.get('ProductName', product.ProductName)
        product.ProductDescription = data.get('Description', product.ProductDescription)
        product.ProductQuantity = data.get('Qty', product.ProductQuantity)
        product.ProductPrice = data.get('Rate', product.ProductPrice)
        
        category_id = data.get('category')
        if category_id and category_id != '' and category_id != 'null':
            product.category_id = category_id
        elif category_id == '' or category_id == 'null':
            product.category_id = None

        product.is_trending = str(data.get('is_trending')).lower() == 'true'
        if request.FILES.get('ProductImage'):
            product.ProductImage = request.FILES.get('ProductImage')
        product.save()

        # Handle Gallery Update
        gallery_images = request.FILES.getlist('gallery_images')
        for img in gallery_images:
            ProductImageGallery.objects.create(product=product, image=img)

        return Response({'Status': 6000, 'data': 'Product updated successfully'}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'Status': 6001, 'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'Status': 6001, 'data': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def Delete_Product(request, pk):
    profile = request.user.profile
    if profile.role != 'OWNER' and not profile.can_manage_products:
        return Response({'Status': 6001, 'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    try:
        product = Product.objects.get(pk=pk)
        product.delete()
        return Response({'Status': 6000, 'data': 'Product deleted'}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'Status': 6001, 'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
def ProductDetailView(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product, context={'request': request})
        response_data = {'Status': 6000, 'data': serializer.data}
    except Product.DoesNotExist:
        response_data = {'Status': 6001, 'message': 'Product not found'}
    except Exception as e:
        response_data = {'Status': 6001, 'message': str(e)}

    return Response(response_data, status=status.HTTP_200_OK)

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def Dashboard_Stats(request):
    profile = request.user.profile
    if profile.role != 'OWNER' and not profile.can_view_stats:
        return Response({'Status': 6001, 'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    total_revenue = Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0
    
    data = {
        'total_products': total_products,
        'total_orders': total_orders,
        'total_revenue': total_revenue
    }
    return Response({'Status': 6000, 'data': data})

@api_view(["GET"])
def List_Categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True, context={'request': request})
    return Response({'Status': 6000, 'data': serializer.data})

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def Create_Category(request):
    profile = request.user.profile
    if profile.role != 'OWNER' and not profile.can_manage_categories:
        return Response({'Status': 6001, 'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    try:
        name = request.data.get('name')
        image = request.FILES.get('image')
        if name:
            Category.objects.create(name=name, image=image)
            return Response({'Status': 6000, 'data': 'Category created'}, status=status.HTTP_201_CREATED)
        return Response({'Status': 6001, 'data': 'Name required'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'Status': 6001, 'data': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def Update_Category(request, pk):
    profile = request.user.profile
    if profile.role != 'OWNER' and not profile.can_manage_categories:
        return Response({'Status': 6001, 'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    try:
        category = Category.objects.get(pk=pk)
        name = request.data.get('name')
        image = request.FILES.get('image')
        
        if name:
            category.name = name
        if image:
            category.image = image
        category.save()
        
        return Response({'Status': 6000, 'data': 'Category updated'}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'Status': 6001, 'message': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'Status': 6001, 'data': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def Delete_Category(request, pk):
    profile = request.user.profile
    if profile.role != 'OWNER' and not profile.can_manage_categories:
        return Response({'Status': 6001, 'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    try:
        category = Category.objects.get(pk=pk)
        category.delete()
        return Response({'Status': 6000, 'data': 'Category deleted'}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'Status': 6001, 'message': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def Create_Review(request):
    try:
        product_id = request.data.get('product_id')
        rating = request.data.get('rating', 5)
        comment = request.data.get('comment', '')

        if product_id:
            # Verify if user has purchased this product and it's delivered
            has_purchased = OrderItem.objects.filter(
                order__user=request.user,
                product_id=product_id,
                order__status='Delivered'
            ).exists()

            if not has_purchased:
                return Response({
                    'Status': 6001,
                    'data': 'Verified Purchase Required: You can only review products that have been delivered to you.'
                }, status=status.HTTP_403_FORBIDDEN)

            Review.objects.create(
                product_id=product_id,
                user=request.user,
                rating=rating,
                comment=comment
            )
            return Response({'Status': 6000, 'data': 'Review added'}, status=status.HTTP_201_CREATED)
        return Response({'Status': 6001, 'data': 'Product ID required'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'Status': 6001, 'data': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def Toggle_Wishlist(request):
    try:
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'Status': 6001, 'message': 'Product ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        product = Product.objects.get(id=product_id)
        profile = request.user.profile
        
        if product in profile.wishlist.all():
            profile.wishlist.remove(product)
            return Response({'Status': 6000, 'message': 'Removed from wishlist', 'wishlisted': False}, status=status.HTTP_200_OK)
        else:
            profile.wishlist.add(product)
            return Response({'Status': 6000, 'message': 'Added to wishlist', 'wishlisted': True}, status=status.HTTP_200_OK)
            
    except Product.DoesNotExist:
        return Response({'Status': 6001, 'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'Status': 6001, 'data': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def List_Wishlist(request):
    try:
        wishlist = request.user.profile.wishlist.all()
        serializer = ProductSerializer(wishlist, many=True, context={'request': request})
        return Response({'Status': 6000, 'data': serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'Status': 6001, 'data': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def Search_Suggestions(request):
    query = request.GET.get('q', '')
    if len(query) < 2:
        return Response({'Status': 6000, 'data': []})
    
    suggestions = Product.objects.filter(ProductName__icontains=query).values_list('ProductName', flat=True).distinct()[:5]
            
    return Response({'Status': 6000, 'data': list(suggestions)}, status=status.HTTP_200_OK)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def Sync_Cart(request):
    try:
        items = request.data.get('items', [])
        # Clear existing and replace with new state (simplest for sync)
        CartItem.objects.filter(user=request.user).delete()
        
        for item in items:
            CartItem.objects.create(
                user=request.user,
                product_id=item['id'],
                quantity=item['quantity']
            )
        return Response({'Status': 6000, 'message': 'Cart synced'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'Status': 6001, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def Get_Cart(request):
    try:
        cart_items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True, context={'request': request})
        
        # Transform to frontend format
        formatted_data = []
        for item in serializer.data:
            p = item['product_details']
            formatted_data.append({
                'id': p['id'],
                'ProductName': p['ProductName'],
                'ProductImage': p['ProductImage'],
                'Rate': p['Rate'],
                'quantity': item['quantity']
            })
            
        return Response({'Status': 6000, 'data': formatted_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'Status': 6001, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)