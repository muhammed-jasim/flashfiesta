from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from store.models import Order, OrderItem, Product
from .serializers import OrderSerializer
from django.db import transaction
from django.db.models import Sum

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    data = request.data
    user = request.user
    
    items = data.get('items', [])
    if not items:
        return Response({'Status': 6001, 'message': 'No items in order'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            # Create the order object first
            order = Order.objects.create(
                user=user,
                full_name=data.get('full_name'),
                address=data.get('address'),
                city=data.get('city'),
                zip_code=data.get('zip_code'),
                total_amount=0 # Placeholder
            )

            calculated_total = 0
            for item in items:
                product_id = item.get('product_id')
                product = Product.objects.get(id=product_id)
                
                qty = int(item.get('quantity', 1))
                item_price = float(product.ProductPrice or 0)
                
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=qty,
                    price=item_price
                )
                
                # Update stock
                product.ProductQuantity -= qty
                product.save()
                
                calculated_total += (item_price * qty)

            # Use the calculated total explicitly
            order.total_amount = calculated_total
            order.save()

            return Response({
                'Status': 6000,
                'message': 'Order placed successfully',
                'order_id': order.id
            }, status=status.HTTP_201_CREATED)
            
    except Product.DoesNotExist:
        return Response({'Status': 6001, 'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'Status': 6001, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    orders = Order.objects.filter(user=request.user).prefetch_related('items', 'items__product').order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response({
        'Status': 6000,
        'data': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    profile = request.user.profile
    if profile.role != 'OWNER' and not profile.can_view_stats:
        return Response({'Status': 6001, 'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
    total_orders = Order.objects.count()
    total_revenue = Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0
    total_products = Product.objects.count()
    
    # Real sales by day for the last 7 days
    from django.utils import timezone
    from datetime import timedelta
    
    recent_sales = []
    today = timezone.now().date()
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_orders = Order.objects.filter(created_at__date=day)
        revenue = day_orders.aggregate(total=Sum('total_amount'))['total'] or 0
        sales_count = day_orders.count()
        recent_sales.append({
            'name': day.strftime('%a'),
            'sales': sales_count,
            'revenue': float(revenue)
        })
    
    stats = {
        'total_orders': total_orders,
        'total_revenue': float(total_revenue),
        'total_products': total_products,
        'recent_sales': recent_sales
    }
    
    return Response({
        'Status': 6000,
        'data': stats
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_orders(request):
    profile = request.user.profile
    if profile.role != 'OWNER' and not profile.can_manage_orders:
        return Response({'Status': 6001, 'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    orders = Order.objects.all().prefetch_related('items', 'items__product').order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response({
        'Status': 6000,
        'data': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_order_status(request, pk):
    profile = request.user.profile
    if profile.role != 'OWNER' and not profile.can_manage_orders:
        return Response({'Status': 6001, 'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    try:
        order = Order.objects.get(pk=pk)
        new_status = request.data.get('status')
        if new_status:
            order.status = new_status
            order.save()
            return Response({'Status': 6000, 'message': 'Status updated'}, status=status.HTTP_200_OK)
        return Response({'Status': 6001, 'message': 'Status not provided'}, status=status.HTTP_400_BAD_REQUEST)
    except Order.DoesNotExist:
        return Response({'Status': 6001, 'message': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_detail(request, pk):
    profile = request.user.profile
    if profile.role != 'OWNER' and not profile.can_manage_orders:
        return Response({'Status': 6001, 'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    try:
        order = Order.objects.prefetch_related('items', 'items__product').get(pk=pk)
        serializer = OrderSerializer(order)
        return Response({'Status': 6000, 'data': serializer.data}, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({'Status': 6001, 'message': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
