# BACKEND/app/views.py

from django.http import JsonResponse
from .models import Produto, Grupo, Unidade, Cidade
from django.views.decorators.csrf import csrf_exempt
import json

# Seus imports existentes que não foram modificados
from django.shortcuts import render, get_object_or_404

# Suas views existentes que você já tinha
def Configuracoes(request):
    context = {}
    return render(request, 'pages/configuracoes.html', context=context)

def Produtos(request):
    context = {}
    return render(request, 'pages/produtos.html', context=context)

def Index(request):
    context = {}
    return render(request, 'index.html', context=context)

def DeletarProduto(request, id):
    pass
    return JsonResponse({'status': 'success', 'message': 'Funcionalidade de deletar produto pendente.'})

# --- Views de API (JSON) ---

@csrf_exempt
def api_produtos_list_create(request):
    if request.method == 'GET':
        produtos = Produto.objects.all().values(
            'id', 'descricao', 'preco', 'qntEstoque', 'codExterno',
            'grupo__grupo', 'unidade__titulo'
        )
        return JsonResponse(list(produtos), safe=False)
    return JsonResponse({'error': 'Método não permitido'}, status=405)

@csrf_exempt
def api_produtos_detail(request, pk):
    produto = get_object_or_404(Produto, pk=pk)

    if request.method == 'GET':
        data = {
            'id': produto.id,
            'descricao': produto.descricao,
            'preco': str(produto.preco),
            'margemVenda': str(produto.margemVenda),
            'peso': str(produto.peso),
            'medidas': produto.medidas,
            'qntEstoque': produto.qntEstoque,
            'qntMin': produto.qntMin,
            'codExterno': produto.codExterno,
            'dataCadastro': produto.dataCadastro.isoformat(),
            'dataModificacao': produto.dataModificacao.isoformat(),
            'grupo_id': produto.grupo_id,
            'grupo__grupo': produto.grupo.grupo if produto.grupo else None,
            'unidade_id': produto.unidade_id,
            'unidade__titulo': produto.unidade.titulo if produto.unidade else None,
        }
        return JsonResponse(data)
    elif request.method == 'DELETE':
        try:
            produto_descricao = produto.descricao
            produto.delete()
            return JsonResponse({'message': f'Produto "{produto_descricao}" (ID: {pk}) excluído com sucesso.'}, status=204)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método não permitido'}, status=405)


@csrf_exempt
def api_grupos(request, pk=None):
    if request.method == 'GET':
        if pk:
            grupo = get_object_or_404(Grupo, pk=pk)
            return JsonResponse({'id': grupo.id, 'grupo': grupo.grupo})
        else:
            grupos = Grupo.objects.all().values('id', 'grupo')
            return JsonResponse(list(grupos), safe=False)
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            if 'grupo' not in data or not data['grupo'].strip():
                return JsonResponse({'error': 'O campo "grupo" é obrigatório e não pode ser vazio.'}, status=400)
            novo_grupo = Grupo.objects.create(grupo=data['grupo'])
            return JsonResponse({'id': novo_grupo.id, 'grupo': novo_grupo.grupo}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Requisição inválida: corpo JSON malformado.'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'Campo "grupo" é obrigatório.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method == 'PUT':
        if pk is None:
            return JsonResponse({'error': 'ID do grupo não fornecido para atualização.'}, status=400)
        try:
            grupo_existente = get_object_or_404(Grupo, pk=pk)
            data = json.loads(request.body)
            if 'grupo' not in data or not data['grupo'].strip():
                return JsonResponse({'error': 'O campo "grupo" é obrigatório e não pode ser vazio.'}, status=400)

            grupo_existente.grupo = data['grupo']
            grupo_existente.save()

            return JsonResponse({'id': grupo_existente.id, 'grupo': grupo_existente.grupo}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Requisição inválida: corpo JSON malformado.'}, status=400)
        except KeyError:
            return JsonResponse({'error': 'Campo "grupo" é obrigatório.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method == 'DELETE':
        if pk is None:
            return JsonResponse({'error': 'ID do grupo não fornecido para exclusão.'}, status=400)
        try:
            grupo = get_object_or_404(Grupo, pk=pk)
            grupo_nome = grupo.grupo
            grupo.delete()
            return JsonResponse({'message': f'Grupo "{grupo_nome}" (ID: {pk}) excluído com sucesso.'}, status=204)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método não permitido'}, status=405)

@csrf_exempt
def api_unidades(request, pk=None):
    if request.method == 'GET':
        if pk:
            unidade = get_object_or_404(Unidade, pk=pk)
            return JsonResponse({'id': unidade.id, 'titulo': unidade.titulo, 'descricao': unidade.descricao})
        else:
            unidades = Unidade.objects.all().values('id', 'titulo', 'descricao')
            return JsonResponse(list(unidades), safe=False)
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            if 'titulo' not in data or not data['titulo'].strip():
                return JsonResponse({'error': 'O campo "titulo" é obrigatório e não pode ser vazio.'}, status=400)
            if 'descricao' not in data or not data['descricao'].strip():
                return JsonResponse({'error': 'O campo "descricao" é obrigatório e não pode ser vazio.'}, status=400)
            nova_unidade = Unidade.objects.create(
                titulo=data['titulo'],
                descricao=data['descricao']
            )
            return JsonResponse({
                'id': nova_unidade.id,
                'titulo': nova_unidade.titulo,
                'descricao': nova_unidade.descricao
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Requisição inválida: corpo JSON malformado.'}, status=400)
        except KeyError as e:
            return JsonResponse({'error': f'Campo obrigatório ausente: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method == 'PUT': # Lógica para Edição (UPDATE) de Unidades
        if pk is None:
            return JsonResponse({'error': 'ID da unidade não fornecido para atualização.'}, status=400)
        try:
            unidade_existente = get_object_or_404(Unidade, pk=pk)
            data = json.loads(request.body)
            if 'titulo' not in data or not data['titulo'].strip():
                return JsonResponse({'error': 'O campo "titulo" é obrigatório e não pode ser vazio.'}, status=400)
            if 'descricao' not in data or not data['descricao'].strip():
                return JsonResponse({'error': 'O campo "descricao" é obrigatório e não pode ser vazio.'}, status=400)

            unidade_existente.titulo = data['titulo']
            unidade_existente.descricao = data['descricao']
            unidade_existente.save()

            return JsonResponse({
                'id': unidade_existente.id,
                'titulo': unidade_existente.titulo,
                'descricao': unidade_existente.descricao
            }, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Requisição inválida: corpo JSON malformado.'}, status=400)
        except KeyError as e:
            return JsonResponse({'error': f'Campo obrigatório ausente: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method == 'DELETE':
        if pk is None:
            return JsonResponse({'error': 'ID da unidade não fornecido para exclusão.'}, status=400)
        try:
            unidade = get_object_or_404(Unidade, pk=pk)
            unidade_titulo = unidade.titulo
            unidade.delete()
            return JsonResponse({'message': f'Unidade "{unidade_titulo}" (ID: {pk}) excluída com sucesso.'}, status=204)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método não permitido'}, status=405)

@csrf_exempt
def api_cidades(request, pk=None):
    if request.method == 'GET':
        if pk:
            cidade = get_object_or_404(Cidade, pk=pk)
            return JsonResponse({'id': cidade.id, 'cidade': cidade.cidade, 'uf': cidade.uf})
        else:
            cidades = Cidade.objects.all().values('id', 'cidade', 'uf')
            return JsonResponse(list(cidades), safe=False)
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            if 'cidade' not in data or not data['cidade'].strip():
                return JsonResponse({'error': 'O campo "cidade" é obrigatório e não pode ser vazio.'}, status=400)
            if 'uf' not in data or not data['uf'].strip() or len(data['uf'].strip()) != 2:
                return JsonResponse({'error': 'O campo "uf" é obrigatório e deve ter 2 caracteres.'}, status=400)
            nova_cidade = Cidade.objects.create(
                cidade=data['cidade'],
                uf=data['uf'].upper()
            )
            return JsonResponse({
                'id': nova_cidade.id,
                'cidade': nova_cidade.cidade,
                'uf': nova_cidade.uf
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Requisição inválida: corpo JSON malformado.'}, status=400)
        except KeyError as e:
            return JsonResponse({'error': f'Campo obrigatório ausente: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method == 'PUT': # Lógica para Edição (UPDATE) de Cidades
        if pk is None:
            return JsonResponse({'error': 'ID da cidade não fornecido para atualização.'}, status=400)
        try:
            cidade_existente = get_object_or_404(Cidade, pk=pk)
            data = json.loads(request.body)
            if 'cidade' not in data or not data['cidade'].strip():
                return JsonResponse({'error': 'O campo "cidade" é obrigatório e não pode ser vazio.'}, status=400)
            if 'uf' not in data or not data['uf'].strip() or len(data['uf'].strip()) != 2:
                return JsonResponse({'error': 'O campo "uf" é obrigatório e deve ter 2 caracteres.'}, status=400)

            cidade_existente.cidade = data['cidade']
            cidade_existente.uf = data['uf'].upper()
            cidade_existente.save()

            return JsonResponse({
                'id': cidade_existente.id,
                'cidade': cidade_existente.cidade,
                'uf': cidade_existente.uf
            }, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Requisição inválida: corpo JSON malformado.'}, status=400)
        except KeyError as e:
            return JsonResponse({'error': f'Campo obrigatório ausente: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method == 'DELETE':
        if pk is None:
            return JsonResponse({'error': 'ID da cidade não fornecido para exclusão.'}, status=400)
        try:
            cidade = get_object_or_404(Cidade, pk=pk)
            cidade_nome = cidade.cidade
            cidade.delete()
            return JsonResponse({'message': f'Cidade "{cidade_nome}" (ID: {pk}) excluída com sucesso.'}, status=204)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método não permitido'}, status=405)