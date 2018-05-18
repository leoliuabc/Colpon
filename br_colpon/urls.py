#!/usr/bin/env python
#-*- coding:utf8 -*-
#Author: Leo 
#Email: leoliuabc@gmail.com
#Date: 2018-05-05

from django.conf.urls import url
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^stores/$', views.stores, name='stores'),
    url(r'^store/(?P<slug>[\w-]+)/$', views.store, name='store'),
    url(r'^offers/$', views.offers, name='offers'),
    url(r'^offer/(?P<id>[0-9]+)/$', views.offer, name='offer'),
    url(r'^search/$', views.search, name='search'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
