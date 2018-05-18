from django.contrib import admin
from .models import Store, Offer

class StoreAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'mod_date', 'pub_date', 'status', 'ishot']
    search_fields = ['name']
    list_filter = ['pub_date']
admin.site.register(Store, StoreAdmin)

class OfferAdmin(admin.ModelAdmin):
    list_display = ['name', 'store', 'type', 'code', 'mod_date', 'pub_date', 'status', 'ishot']
    search_fields = ['name']
    list_filter = ['pub_date']
admin.site.register(Offer, OfferAdmin)
