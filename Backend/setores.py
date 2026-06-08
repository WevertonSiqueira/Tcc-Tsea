from flask import Blueprint, request, jsonify, current_app
from services import SetorService

setores_bp = Blueprint('setores', __name__)
setor_service = SetorService()


@setores_bp.route('/setores', methods=['GET'])
def list_setores():
    """Lista todos os setores do Supabase"""
    try:
        setores = setor_service.get_all_setores()
        return jsonify(setores)
    except Exception as e:
        current_app.logger.error('Erro ao buscar setores: %s', e)
        return jsonify({'error': 'Erro ao buscar setores'}), 500


@setores_bp.route('/setores/<int:setor_id>', methods=['GET'])
def get_setor(setor_id):
    """Busca um setor específico por ID"""
    try:
        setor = setor_service.get_setor_by_id(setor_id)
        if not setor:
            return jsonify({'error': 'Setor não encontrado'}), 404
        return jsonify(setor)
    except Exception as e:
        current_app.logger.error('Erro ao buscar setor: %s', e)
        return jsonify({'error': 'Erro ao buscar setor'}), 500


@setores_bp.route('/setores/user/<user_id>', methods=['GET'])
def get_setores_by_user(user_id):
    """Busca setores de um usuário específico"""
    try:
        setores = setor_service.get_setores_by_user(user_id)
        return jsonify(setores)
    except Exception as e:
        current_app.logger.error('Erro ao buscar setores do usuário: %s', e)
        return jsonify({'error': 'Erro ao buscar setores do usuário'}), 500


@setores_bp.route('/setores', methods=['POST'])
def create_setor():
    """Cria um novo setor"""
    try:
        data = request.get_json() or {}
        setor = setor_service.create_setor(data)
        return jsonify(setor), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        current_app.logger.error('Erro ao criar setor: %s', e)
        return jsonify({'error': 'Erro ao criar setor'}), 500


@setores_bp.route('/setores/<int:setor_id>', methods=['PUT'])
def update_setor(setor_id):
    """Atualiza um setor existente"""
    try:
        data = request.get_json() or {}
        setor = setor_service.update_setor(setor_id, data)
        return jsonify(setor)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        current_app.logger.error('Erro ao atualizar setor: %s', e)
        return jsonify({'error': 'Erro ao atualizar setor'}), 500


@setores_bp.route('/setores/<int:setor_id>', methods=['DELETE'])
def delete_setor(setor_id):
    """Deleta um setor"""
    try:
        setor_service.delete_setor(setor_id)
        return jsonify({'result': 'deleted'})
    except Exception as e:
        current_app.logger.error('Erro ao deletar setor: %s', e)
        return jsonify({'error': 'Erro ao deletar setor'}), 500
