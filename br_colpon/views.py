from django.shortcuts import render
from .models import Store, Offer
from django.http import Http404

def home(request):
    hotstores = Store.objects.filter(status=True, ishot=True)
    hotoffers = Offer.objects.filter(status=True, ishot=True)
    context = {
        'hotstores': hotstores,
        'hotoffers': hotoffers,
    }
    return render(request, 'br_colpon/home.html', context)

def stores(request):
    stores = Store.objects.filter(status=True)
    context = {'stores': stores}
    return render(request, 'br_colpon/stores.html', context)

def store(request, slug):
    try:
        store = Store.objects.get(slug=slug)
        hotstores = Store.objects.filter(status=True, ishot=True)
        offers = Offer.objects.filter(status=True, store_id=store.id).order_by('-ishot')
        hotoffers = Offer.objects.filter(status=True, ishot=True)
        context = {
            'store': store,
            'offers': offers,
            'hotstores': hotstores,
            'hotoffers': hotoffers,
        }
    except Store.DoesNotExist:
        raise Http404('Store does not exist')
    return render(request, 'br_colpon/store.html', context)

def offers(request):
    hotstores = Store.objects.filter(status=True, ishot=True)
    hotoffers = Offer.objects.filter(status=True, ishot=True)
    context = {
        'hotstores': hotstores,
        'hotoffers': hotoffers,
    }
    return render(request, 'br_colpon/offers.html', context)

def offer(request, id):
    try:
        offer = Offer.objects.get(pk=id)
        hotstores = Store.objects.filter(status=True, ishot=True)
        hotoffers = Offer.objects.filter(status=True, ishot=True)
        context = {
            'offer': offer,
            'hotstores': hotstores,
            'hotoffers': hotoffers,
        }
    except Offer.DoesNotexist:
        raise Http404('Offer does not exist')
    return render(request, 'br_colpon/offer.html', context)

def search(request):
    try:
        q = request.GET.get('q')
        stores = Store.objects.filter(name__icontains=q)
        offers = Offer.objects.filter(name__icontains=q)
        context = {
            'stores': stores,
            'offers': offers,
        }
    except Store.DoesNotExist:
        raise Http404('Store does not exist')
    return render(request, 'br_colpon/search.html', context)
