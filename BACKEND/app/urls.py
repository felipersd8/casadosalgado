# BACKEND/app/urls.py

from django.urls import path
from . import views

urlpatterns = [
    # Suas URLs existentes para renderizar templates HTML
    path('configuracoes', views.Configuracoes, name='Configs'),
    path('venda', views.Produtos, name='Venda'),
    path('', views.Index, name='Home'),
    path('produtos', views.Produtos, name='Produtos'),
    path('deletar/produto/<int:id>', views.DeletarProduto, name='deletar/produto'), # Manter por enquanto, mas será substituída

    # --- ROTAS DA API (JSON) ---
    # Produtos API
    path('api/produtos/', views.api_produtos_list_create, name='api_produtos_list_create'), # Para GET (lista) e POST (criação)
    path('api/produtos/<int:pk>/', views.api_produtos_detail, name='api_produtos_detail'), # Para GET (detalhe), PUT (futuro), DELETE

    # Grupos API
    path('api/grupos/', views.api_grupos, name='api_grupos_list_create'),
    path('api/grupos/<int:pk>/', views.api_grupos, name='api_grupos_detail'), # Para GET (detalhe), PUT (futuro), DELETE

    # Unidades API
    path('api/unidades/', views.api_unidades, name='api_unidades_list_create'),
    path('api/unidades/<int:pk>/', views.api_unidades, name='api_unidades_detail'), # Para GET (detalhe), PUT (futuro), DELETE

    # Cidades API
    path('api/cidades/', views.api_cidades, name='api_cidades_list_create'),
    path('api/cidades/<int:pk>/', views.api_cidades, name='api_cidades_detail'), # Para GET (detalhe), PUT (futuro), DELETE
]