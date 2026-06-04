from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import Chapas, Lote
from datetime import datetime
from dotenv import load_dotenv
import os
import json
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db = SQLAlchemy(app)

@app.route('/registrar/Chapas', methods=['POST'])
def registrar_chapas():
    data = request.get_json()
    novaChapa = Chapas(
        id_lote = data['id_lote'],
        id_setor = data['id_setor'],
        peso = data['peso'],
        altura = data['altura'],
        material = data['material'],
        espessura = data['espessura'],
        data_entrada = datetime.now(),
        data_saida = None
    )

    db.session.add(novaChapa)
    db.session.commit()

    return jsonify({'message': 'Chapa registrada com sucesso'}), 201

@app.route('/registrar/Lote', methods=['POST'])
def registrar_lote():
    data = request.get_json()
    novoLote = Lote(
        id = data['id'],
        chapas_quantidade = data['chapas_quantidade'],
        peso_total = data['peso_total'],
        data_emissao = datetime.now(),
        data_termino = None
    )

    db.session.add(novoLote)
    db.session.commit()

    return jsonify({'message': 'Lote registrado com sucesso'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username == 'admin' and password == 'password':
        return jsonify({'message': 'Login successful', 'token': 'fake-jwt-token'})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
        
@app.route('/', methods=['GET'])
def home():
    return "API Running on port: " + os.getenv('PORT')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)