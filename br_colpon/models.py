from django.db import models

class Store(models.Model):
    name = models.CharField(max_length=200, unique=True)
    desc = models.TextField('description')
    link = models.URLField()
    slug = models.SlugField(max_length=200, unique=True)
    status = models.BooleanField(default=True)
    ishot = models.BooleanField(default=False)
    logo = models.ImageField(upload_to='logos')
    pub_date = models.DateTimeField('date published', auto_now_add=True)
    mod_date = models.DateTimeField('date modification', auto_now=True)
    def __str__(self):
        return self.name

class Offer(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    type = models.CharField(max_length=10)
    name = models.CharField(max_length=200)
    desc = models.TextField('description')
    link = models.URLField()
    code = models.CharField(max_length=50, blank=True)
    status = models.BooleanField(default=True)
    ishot = models.BooleanField(default=False)
    pub_date = models.DateTimeField('date published', auto_now_add=True)
    mod_date = models.DateTimeField('date modification', auto_now=True)
    def __str__(self):
        return self.name
