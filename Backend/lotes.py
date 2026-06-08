from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from services import LoteService

lotes_bp = Blueprint('lotes', __name__)
lote_service = LoteService()


@lotes_bp.route('/lotes', methods=['GET'])
def list_lotes():
    """Lista todos os lotes do Supabase"""
    try:
        lotes = lote_service.get_all_lotes()
        return jsonify(lotes)
    except Exception as e:
        current_app.logger.error('Erro ao buscar lotes: %s', e)
        return jsonify({'error': 'Erro ao buscar lotes'}), 500


@lotes_bp.route('/lotes/<int:lote_id>', methods=['GET'])
def get_lote(lote_id):
    """Busca um lote específico por ID"""
    try:
        lote = lote_service.get_lote_by_id(lote_id)
        if not lote:
            return jsonify({'error': 'Lote não encontrado'}), 404
        return jsonify(lote)
    except Exception as e:
        current_app.logger.error('Erro ao buscar lote: %s', e)
        return jsonify({'error': 'Erro ao buscar lote'}), 500


@lotes_bp.route('/lotes', methods=['POST'])
def create_lote():
    """Cria um novo lote"""
    try:
        data = request.get_json() or {}
        
        # Processar datas se fornecidas como strings
        if 'data_emissao' in data and isinstance(data['data_emissao'], str):
            try:
                data['data_emissao'] = datetime.fromisoformat(data['data_emissao']).isoformat()
            except Exception:
                del data['data_emissao']
        
        if 'data_termino' in data and isinstance(data['data_termino'], str):
            try:
                data['data_termino'] = datetime.fromisoformat(data['data_termino']).isoformat()
            except Exception:
                del data['data_termino']
        
        lote = lote_service.create_lote(data)
        return jsonify(lote), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        current_app.logger.error('Erro ao criar lote: %s', e)
        return jsonify({'error': 'Erro ao criar lote'}), 500


@lotes_bp.route('/lotes/<int:lote_id>', methods=['PUT'])
def update_lote(lote_id):
    """Atualiza um lote existente"""
    try:
        data = request.get_json() or {}
        
        # Processar datas se fornecidas como strings
        if 'data_emissao' in data and isinstance(data['data_emissao'], str):
            try:
                data['data_emissao'] = datetime.fromisoformat(data['data_emissao']).isoformat()
            except Exception:
                pass
        
        if 'data_termino' in data and isinstance(data['data_termino'], str):
            try:
                data['data_termino'] = datetime.fromisoformat(data['data_termino']).isoformat()
            except Exception:
                pass
        
        lote = lote_service.update_lote(lote_id, data)
        return jsonify(lote)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        current_app.logger.error('Erro ao atualizar lote: %s', e)
        return jsonify({'error': 'Erro ao atualizar lote'}), 500


@lotes_bp.route('/lotes/<int:lote_id>', methods=['DELETE'])
def delete_lote(lote_id):
    """Deleta um lote"""
    try:
        lote_service.delete_lote(lote_id)
        return jsonify({'result': 'deleted'})
    except Exception as e:
        current_app.logger.error('Erro ao deletar lote: %s', e)
        return jsonify({'error': 'Erro ao deletar lote'}), 500
