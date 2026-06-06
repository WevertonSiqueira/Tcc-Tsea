# Autenticar o login e integrar com JS
import os

from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import Client, create_client

load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL=https://pzhqfstwfyrdqunkxtmd.supabase.co", "")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_znLRqcc4Ws05VuBnUWGSYw_gqvEyoQN", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL e SUPABASE_KEY devem estar configurados no arquivo .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route("/login", methods=["POST"])
def login():
    dados = request.get_json(silent=True)
    if not dados:
        return jsonify({"mensagem": "Requisição inválida: JSON esperado."}), 400

    email = dados.get("email")
    senha = dados.get("senha")
    if not email or not senha:
        return jsonify({"mensagem": "E-mail e senha são obrigatórios."}), 400

    try:
        resposta = supabase.auth.sign_in_with_password({
            "email": email,
            "password": senha,
        })

        if not resposta.session or not resposta.user:
            return jsonify({"mensagem": "E-mail ou senha inválidos."}), 401

        return jsonify({
            "status": "sucesso",
            "token": resposta.session.access_token,
            "refresh_token": resposta.session.refresh_token,
            "user_id": resposta.user.id,
        }), 200

    except Exception as erro:
        mensagem_erro = str(erro)
        print(f"Erro de autenticação: {mensagem_erro}")
        return jsonify({"mensagem": "E-mail ou senha inválidos."}), 401

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)

