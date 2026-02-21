from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({
            'Status': 6000, 
            'message': 'User registered successfully',
            'tokens': tokens,
            'username': user.username,
            'role': user.profile.role
        }, status=status.HTTP_201_CREATED)
    return Response({'Status': 6001, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        from store.models import UserProfile
        # Ensure profile exists (for older users)
        profile, created = UserProfile.objects.get_or_create(user=user)
        tokens = get_tokens_for_user(user)
        return Response({
            'Status': 6000, 
            'message': 'Login successful', 
            'username': user.username,
            'role': profile.role,
            'tokens': tokens
        }, status=status.HTTP_200_OK)
    return Response({'Status': 6001, 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user)
    return Response({'Status': 6000, 'data': serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST', 'PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'Status': 6000, 'message': 'Profile updated', 'data': serializer.data}, status=status.HTTP_200_OK)
    return Response({'Status': 6001, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
