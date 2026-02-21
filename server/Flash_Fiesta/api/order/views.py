from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from store.models import Order, OrderItem, Product
from .serializers import OrderSerializer
from django.db import transaction

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    data = request.data
    user = request.user
    
    try:
        with transaction.atomic():
            # Create Order (initially without total if not provided, we will update it)
            total_amount = data.get('total_amount')
            order = Order.objects.create(
                user=user,
                full_name=data.get('full_name'),
                address=data.get('address'),
                city=data.get('city'),
                zip_code=data.get('zip_code'),
                total_amount=total_amount if total_amount is not None else 0
            )
            
            # Create Order Items
            items = data.get('items', [])
            calculated_total = 0
            for item in items:
                # Use UUID 'id' for reliable unique lookup
                product_id = item.get('product_id')
                product = Product.objects.get(id=product_id)
                
                qty = item.get('quantity', 1)
                item_price = product.ProductPrice or 0
                calculated_total += (item_price * qty)
                
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=qty,
                    price=item_price
                )
                
                # Update Inventory
                if product.ProductQuantity:
                    product.ProductQuantity -= qty
                    product.save()
            
            # Update total if it was missing
            if total_amount is None:
                order.total_amount = calculated_total
                order.save()
            
            return Response({
                'Status': 6000,
                'message': 'Order placed successfully',
                'order_id': str(order.id)
            }, status=status.HTTP_201_CREATED)
            
    except Product.DoesNotExist:
        return Response({'Status': 6001, 'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'Status': 6001, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response({
        'Status': 6000,
        'data': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    # Only for staff/superuser usually, but for this demo we'll allow authenticated
    total_orders = Order.objects.count()
    total_revenue = sum(Order.objects.values_list('total_amount', flat=True))
    total_products = Product.objects.count()
    
    # Simple sales by day (last 7 days)
    # In a real app we'd use aggregation, here we'll mock some if empty or use real if exists
    stats = {
        'total_orders': total_orders,
        'total_revenue': total_revenue,
        'total_products': total_products,
        'recent_sales': [
            {'name': 'Mon', 'sales': 4000, 'revenue': 2400},
            {'name': 'Tue', 'sales': 3200, 'revenue': 1800},
            {'name': 'Wed', 'sales': 5100, 'revenue': 4200},
            {'name': 'Thu', 'sales': 2800, 'revenue': 2100},
            {'name': 'Fri', 'sales': 6200, 'revenue': 5500},
            {'name': 'Sat', 'sales': 4300, 'revenue': 3800},
            {'name': 'Sun', 'sales': 3900, 'revenue': 3100}
        ]
    }
    
    return Response({
        'Status': 6000,
        'data': stats
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_orders(request):
    if request.user.profile.role != 'OWNER':
        return Response({'Status': 6001, 'message': 'Owner only'}, status=status.HTTP_403_FORBIDDEN)
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response({
        'Status': 6000,
        'data': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_order_status(request, pk):
    if request.user.profile.role != 'OWNER':
        return Response({'Status': 6001, 'message': 'Owner only'}, status=status.HTTP_403_FORBIDDEN)
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
    if request.user.profile.role != 'OWNER':
        return Response({'Status': 6001, 'message': 'Owner only'}, status=status.HTTP_403_FORBIDDEN)
    try:
        order = Order.objects.get(pk=pk)
        serializer = OrderSerializer(order)
        return Response({'Status': 6000, 'data': serializer.data}, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({'Status': 6001, 'message': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
