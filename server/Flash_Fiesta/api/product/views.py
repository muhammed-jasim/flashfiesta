from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from store.models import Product, ProductImageGallery, Category, Review, OrderItem
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductSerializer, CategorySerializer, ReviewSerializer


# @api_view(["GET"])
# def ProductView (request):
#   productModel = ProductSerializer()
#   ProductDetails = []
#   if productModel:
#     print(productModel)
#     for i in productModel:
#         product_detail = {
#             'ProductName': i.ProductName,
#             'ProductID': i.ProductID,
#             # 'ProductImage': str(i.ProductImage) 
#         }
#         ProductDetails.append(product_detail)

#     respoonse_data ={'Status':6000,'data' : ProductDetails}
#   else:
#     respoonse_data ={'Status':6001,'data' : ProductDetails}
  
#   return Response (respoonse_data,status=status.HTTP_200_OK)

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
    if request.user.profile.role not in ['OWNER', 'EMPLOYEE']:
        return Response({'Status': 6001, 'message': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    try:
        ProductName = request.data.get('ProductName')
        Description = request.data.get('Description', '')
        ProductImage = request.FILES.get('ProductImage')
        gallery_images = request.FILES.getlist('gallery_images')
        Qty = request.data.get('Qty', 0)
        Rate = request.data.get('Rate', 0)
        category_id = request.data.get('category')
        is_trending = request.data.get('is_trending') == 'true'

        if ProductName:
            product = Product.objects.create(
                ProductName=ProductName,
                ProductDescription=Description,
                ProductImage=ProductImage,
                ProductQuantity=Qty,
                ProductPrice=Rate,
                category_id=category_id,
                is_trending=is_trending
            )
            
            for img in gallery_images:
                ProductImageGallery.objects.create(product=product, image=img)
                
            return Response({'Status': 6000, 'data': 'Product created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'Status': 6001, 'data': 'Provide valid data'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'Status': 6001, 'data': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
    if request.user.profile.role != 'OWNER':
        return Response({'Status': 6001, 'message': 'Owner only'}, status=status.HTTP_403_FORBIDDEN)
    
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    total_revenue = sum(o.total_amount for o in Order.objects.all())
    
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
    if request.user.profile.role not in ['OWNER', 'EMPLOYEE']:
        return Response({'Status': 6001, 'message': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
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