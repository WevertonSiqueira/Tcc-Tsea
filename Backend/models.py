from datetime import datetime
from database import db


class Lote(db.Model):
    """
    Modelo da tabela lote
    Correspondente à tabela 'lote' no Supabase PostgreSQL
    """
    __tablename__ = 'lote'
    
    id = db.Column(db.Integer, primary_key=True)
    chapas_quantidade = db.Column(db.Integer, nullable=True)
    peso_total = db.Column(db.Numeric(10, 2), nullable=True)
    data_emissao = db.Column(db.DateTime, nullable=True)
    data_termino = db.Column(db.DateTime, nullable=True)
    
    # Relacionamentos
    chapas = db.relationship('Chapa', backref='lote', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'chapas_quantidade': self.chapas_quantidade,
            'peso_total': float(self.peso_total) if self.peso_total is not None else None,
            'data_emissao': self.data_emissao.isoformat() if self.data_emissao else None,
            'data_termino': self.data_termino.isoformat() if self.data_termino else None,
        }


class Chapa(db.Model):
    """
    Modelo da tabela chapas
    Correspondente à tabela 'chapas' no Supabase PostgreSQL
    """
    __tablename__ = 'chapas'
    
    id = db.Column(db.Integer, primary_key=True)
    id_lote = db.Column(db.Integer, db.ForeignKey('lote.id'), nullable=True)
    id_setor = db.Column(db.Integer, db.ForeignKey('setor.id'), nullable=True)
    peso = db.Column(db.Numeric(10, 2), nullable=True)
    altura = db.Column(db.Numeric(10, 2), nullable=True)
    material = db.Column(db.String(100), nullable=True)
    espessura = db.Column(db.Numeric(5, 2), nullable=True)
    data_entrada = db.Column(db.DateTime, nullable=True)
    data_saida = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'id_lote': self.id_lote,
            'id_setor': self.id_setor,
            'peso': float(self.peso) if self.peso is not None else None,
            'altura': float(self.altura) if self.altura is not None else None,
            'material': self.material,
            'espessura': float(self.espessura) if self.espessura is not None else None,
            'data_entrada': self.data_entrada.isoformat() if self.data_entrada else None,
            'data_saida': self.data_saida.isoformat() if self.data_saida else None,
        }


class Setor(db.Model):
    """
    Modelo da tabela setor
    Correspondente à tabela 'setor' no Supabase PostgreSQL
    """
    __tablename__ = 'setor'
    
    id = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.String(100), nullable=True)  # UUID do usuário Supabase
    setor = db.Column(db.String(100), nullable=False)
    chapas_quantidade = db.Column(db.Integer, nullable=True, default=0)
    
    # Relacionamentos
    chapas = db.relationship('Chapa', backref='setor', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'id_user': self.id_user,
            'setor': self.setor,
            'chapas_quantidade': self.chapas_quantidade,
        }
