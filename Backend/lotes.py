from flask import Blueprint, request, jsonify
from datetime import datetime
from database import db

lotes_bp = Blueprint('lotes', __name__)


class Lote(db.Model):
    __tablename__ = 'lotes'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    peso = db.Column(db.Float, nullable=True)
    status = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'peso': self.peso,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


@lotes_bp.route('/lotes', methods=['GET'])
def list_lotes():
    lotes = Lote.query.order_by(Lote.created_at.desc()).all()
    return jsonify([l.to_dict() for l in lotes])


@lotes_bp.route('/lotes/<int:lote_id>', methods=['GET'])
def get_lote(lote_id):
    lote = Lote.query.get_or_404(lote_id)
    return jsonify(lote.to_dict())


@lotes_bp.route('/lotes', methods=['POST'])
def create_lote():
    data = request.get_json() or {}
    nome = data.get('nome')
    peso = data.get('peso')
    status = data.get('status', 'pendente')
    if not nome:
        return jsonify({'error': 'nome é obrigatório'}), 400

    lote = Lote(nome=nome, peso=peso, status=status)
    db.session.add(lote)
    db.session.commit()
    return jsonify(lote.to_dict()), 201


@lotes_bp.route('/lotes/<int:lote_id>', methods=['PUT'])
def update_lote(lote_id):
    lote = Lote.query.get_or_404(lote_id)
    data = request.get_json() or {}
    lote.nome = data.get('nome', lote.nome)
    lote.peso = data.get('peso', lote.peso)
    lote.status = data.get('status', lote.status)
    db.session.commit()
    return jsonify(lote.to_dict())


@lotes_bp.route('/lotes/<int:lote_id>', methods=['DELETE'])
def delete_lote(lote_id):
    lote = Lote.query.get_or_404(lote_id)
    db.session.delete(lote)
    db.session.commit()
    return jsonify({'result': 'deleted'})
from flask import Flask  
