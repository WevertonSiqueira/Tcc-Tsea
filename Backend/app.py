from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS
from database import db
from services import AuthService

load_dotenv()

app = Flask(__name__)

# CORS configuration - allow frontend origin
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5500", "http://127.0.0.1:5500"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Database - PostgreSQL only (Supabase)
database_url = os.getenv('DATABASE_URL')
if not database_url:
    raise ValueError('DATABASE_URL environment variable is required. Please configure it in .env file')

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Initialize Auth Service
auth_service = AuthService()

# Register blueprints
from lotes import lotes_bp
from chapas import chapas_bp
from setores import setores_bp

app.register_blueprint(lotes_bp, url_prefix='/api')
app.register_blueprint(chapas_bp, url_prefix='/api')
app.register_blueprint(setores_bp, url_prefix='/api')


@app.route('/login', methods=['POST'])
def login():
    """Endpoint de login usando Supabase Auth"""
    data = request.get_json(silent=True) or {}
    app.logger.info('Login request payload: %s', data)
    
    # Aceita ambos os estilos de nomenclatura
    email = data.get('email') or data.get('username')
    password = data.get('senha') or data.get('password')

    if not email or not password:
        return jsonify({'mensagem': 'E-mail/usuário e senha são obrigatórios.'}), 400

    try:
        result = auth_service.sign_in_with_password(email, password)
        return jsonify(result), 200
    except ValueError as e:
        app.logger.warning('Erro de autenticação: %s', e)
        return jsonify({'mensagem': str(e)}), 401
    except Exception as e:
        app.logger.exception('Erro ao autenticar no Supabase: %s', e)
        return jsonify({'mensagem': 'Erro ao autenticar (ver servidor).'}), 500


@app.route('/', methods=['GET'])
def home():
    return "Ts is running le'go "


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)