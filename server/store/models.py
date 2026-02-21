from django.db import models
import uuid
# Create your models here.

class DashBoardSwiper(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  name = models.CharField(max_length=255, blank=True,null=True)
  category = models.CharField(max_length=255, blank=True,null=True)
  categoryImage = models.ImageField(upload_to='dashboard')

class Product(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  ProductID = models.IntegerField(unique=True, blank=True, null=True)
  ProductName = models.CharField(max_length=255, blank=True,null=True)
  ProductDescription = models.TextField(blank=True,null=True)
  ProductPrice = models.FloatField(max_length=255, blank=True,null=True)
  ProductImage = models.ImageField(upload_to='dashboard')
  ProductQuantity = models.IntegerField()