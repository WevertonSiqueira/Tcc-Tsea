from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from services import ChapaService

chapas_bp = Blueprint('chapas', __name__)
chapa_service = ChapaService()


@chapas_bp.route('/chapas', methods=['GET'])
def list_chapas():
    """Lista todas as chapas do Supabase"""
    try:
        chapas = chapa_service.get_all_chapas()
        return jsonify(chapas)
    except Exception as e:
        current_app.logger.error('Erro ao buscar chapas: %s', e)
        return jsonify({'error': 'Erro ao buscar chapas'}), 500


@chapas_bp.route('/chapas/<int:chapa_id>', methods=['GET'])
def get_chapa(chapa_id):
    """Busca uma chapa específica por ID"""
    try:
        chapa = chapa_service.get_chapa_by_id(chapa_id)
        if not chapa:
            return jsonify({'error': 'Chapa não encontrada'}), 404
        return jsonify(chapa)
    except Exception as e:
        current_app.logger.error('Erro ao buscar chapa: %s', e)
        return jsonify({'error': 'Erro ao buscar chapa'}), 500


@chapas_bp.route('/chapas/lote/<int:lote_id>', methods=['GET'])
def get_chapas_by_lote(lote_id):
    """Busca chapas de um lote específico"""
    try:
        chapas = chapa_service.get_chapas_by_lote(lote_id)
        return jsonify(chapas)
    except Exception as e:
        current_app.logger.error('Erro ao buscar chapas do lote: %s', e)
        return jsonify({'error': 'Erro ao buscar chapas do lote'}), 500


@chapas_bp.route('/chapas', methods=['POST'])
def create_chapa():
    """Cria uma nova chapa"""
    try:
        data = request.get_json() or {}
        
        # Processar datas se fornecidas como strings
        if 'data_entrada' in data and isinstance(data['data_entrada'], str):
            try:
                data['data_entrada'] = datetime.fromisoformat(data['data_entrada']).isoformat()
            except Exception:
                del data['data_entrada']
        
        if 'data_saida' in data and isinstance(data['data_saida'], str):
            try:
                data['data_saida'] = datetime.fromisoformat(data['data_saida']).isoformat()
            except Exception:
                del data['data_saida']
        
        chapa = chapa_service.create_chapa(data)
        return jsonify(chapa), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        current_app.logger.error('Erro ao criar chapa: %s', e)
        return jsonify({'error': 'Erro ao criar chapa'}), 500


@chapas_bp.route('/chapas/<int:chapa_id>', methods=['PUT'])
def update_chapa(chapa_id):
    """Atualiza uma chapa existente"""
    try:
        data = request.get_json() or {}
        
        # Processar datas se fornecidas como strings
        if 'data_entrada' in data and isinstance(data['data_entrada'], str):
            try:
                data['data_entrada'] = datetime.fromisoformat(data['data_entrada']).isoformat()
            except Exception:
                pass
        
        if 'data_saida' in data and isinstance(data['data_saida'], str):
            try:
                data['data_saida'] = datetime.fromisoformat(data['data_saida']).isoformat()
            except Exception:
                pass
        
        chapa = chapa_service.update_chapa(chapa_id, data)
        return jsonify(chapa)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        current_app.logger.error('Erro ao atualizar chapa: %s', e)
        return jsonify({'error': 'Erro ao atualizar chapa'}), 500


@chapas_bp.route('/chapas/<int:chapa_id>', methods=['DELETE'])
def delete_chapa(chapa_id):
    """Deleta uma chapa"""
    try:
        chapa_service.delete_chapa(chapa_id)
        return jsonify({'result': 'deleted'})
    except Exception as e:
        current_app.logger.error('Erro ao deletar chapa: %s', e)
        return jsonify({'error': 'Erro ao deletar chapa'}), 500
