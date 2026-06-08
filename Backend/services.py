"""
Camada de Serviços - Acesso aos Dados

Esta camada é responsável por toda a lógica de acesso aos dados,
separando a lógica de negócio dos controllers.
"""
import os
from typing import List, Dict, Optional, Any
from supabase import create_client


class SupabaseService:
    """Serviço para acesso ao Supabase"""
    
    def __init__(self):
        self.url = os.getenv('SUPABASE_URL')
        self.key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_KEY')
        
        if not self.url or not self.key:
            raise ValueError('SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórios')
        
        self.client = create_client(self.url, self.key)
    
    def get_all(self, table: str, order_by: str = 'id', ascending: bool = False) -> List[Dict]:
        """Busca todos os registros de uma tabela"""
        try:
            response = self.client.table(table).select('*').order(order_by, desc=not ascending).execute()
            return response.data if hasattr(response, 'data') else response.get('data', [])
        except Exception as e:
            print(f'Erro ao buscar {table}: {e}')
            return []
    
    def get_by_id(self, table: str, record_id: int) -> Optional[Dict]:
        """Busca um registro por ID"""
        try:
            response = self.client.table(table).select('*').eq('id', record_id).execute()
            data = response.data if hasattr(response, 'data') else response.get('data', [])
            return data[0] if data else None
        except Exception as e:
            print(f'Erro ao buscar {table} por ID: {e}')
            return None
    
    def create(self, table: str, data: Dict) -> Optional[Dict]:
        """Cria um novo registro"""
        try:
            response = self.client.table(table).insert(data).select().execute()
            result = response.data if hasattr(response, 'data') else response.get('data', [])
            return result[0] if result else None
        except Exception as e:
            print(f'Erro ao criar em {table}: {e}')
            raise
    
    def update(self, table: str, record_id: int, data: Dict) -> Optional[Dict]:
        """Atualiza um registro"""
        try:
            response = self.client.table(table).update(data).eq('id', record_id).select().execute()
            result = response.data if hasattr(response, 'data') else response.get('data', [])
            return result[0] if result else None
        except Exception as e:
            print(f'Erro ao atualizar {table}: {e}')
            raise
    
    def delete(self, table: str, record_id: int) -> bool:
        """Deleta um registro"""
        try:
            self.client.table(table).delete().eq('id', record_id).execute()
            return True
        except Exception as e:
            print(f'Erro ao deletar de {table}: {e}')
            raise


class LoteService:
    """Serviço específico para Lotes"""
    
    def __init__(self):
        self.supabase = SupabaseService()
        self.table = 'lote'  # Nome da tabela no banco de dados é SINGULAR
    
    def get_all_lotes(self) -> List[Dict]:
        """Busca todos os lotes"""
        lotes = self.supabase.get_all(self.table, order_by='id', ascending=False)
        return lotes
    
    def get_lote_by_id(self, lote_id: int) -> Optional[Dict]:
        """Busca um lote por ID"""
        return self.supabase.get_by_id(self.table, lote_id)
    
    def create_lote(self, data: Dict) -> Dict:
        """Cria um novo lote"""
        # Validação de campos
        required_fields = []
        for field in required_fields:
            if field not in data:
                raise ValueError(f'Campo {field} é obrigatório')
        
        return self.supabase.create(self.table, data)
    
    def update_lote(self, lote_id: int, data: Dict) -> Dict:
        """Atualiza um lote"""
        return self.supabase.update(self.table, lote_id, data)
    
    def delete_lote(self, lote_id: int) -> bool:
        """Deleta um lote"""
        return self.supabase.delete(self.table, lote_id)


class ChapaService:
    """Serviço específico para Chapas"""
    
    def __init__(self):
        self.supabase = SupabaseService()
        self.table = 'chapas'
    
    def get_all_chapas(self) -> List[Dict]:
        """Busca todas as chapas"""
        return self.supabase.get_all(self.table, order_by='id', ascending=False)
    
    def get_chapas_by_lote(self, lote_id: int) -> List[Dict]:
        """Busca chapas de um lote específico"""
        try:
            response = self.supabase.client.table(self.table).select('*').eq('id_lote', lote_id).execute()
            return response.data if hasattr(response, 'data') else response.get('data', [])
        except Exception as e:
            print(f'Erro ao buscar chapas do lote {lote_id}: {e}')
            return []
    
    def get_chapa_by_id(self, chapa_id: int) -> Optional[Dict]:
        """Busca uma chapa por ID"""
        return self.supabase.get_by_id(self.table, chapa_id)
    
    def create_chapa(self, data: Dict) -> Dict:
        """Cria uma nova chapa"""
        return self.supabase.create(self.table, data)
    
    def update_chapa(self, chapa_id: int, data: Dict) -> Dict:
        """Atualiza uma chapa"""
        return self.supabase.update(self.table, chapa_id, data)
    
    def delete_chapa(self, chapa_id: int) -> bool:
        """Deleta uma chapa"""
        return self.supabase.delete(self.table, chapa_id)


class SetorService:
    """Serviço específico para Setores"""
    
    def __init__(self):
        self.supabase = SupabaseService()
        self.table = 'setor'
    
    def get_all_setores(self) -> List[Dict]:
        """Busca todos os setores"""
        return self.supabase.get_all(self.table, order_by='id', ascending=False)
    
    def get_setor_by_id(self, setor_id: int) -> Optional[Dict]:
        """Busca um setor por ID"""
        return self.supabase.get_by_id(self.table, setor_id)
    
    def get_setores_by_user(self, user_id: str) -> List[Dict]:
        """Busca setores de um usuário específico"""
        try:
            response = self.supabase.client.table(self.table).select('*').eq('id_user', user_id).execute()
            return response.data if hasattr(response, 'data') else response.get('data', [])
        except Exception as e:
            print(f'Erro ao buscar setores do usuário {user_id}: {e}')
            return []
    
    def create_setor(self, data: Dict) -> Dict:
        """Cria um novo setor"""
        return self.supabase.create(self.table, data)
    
    def update_setor(self, setor_id: int, data: Dict) -> Dict:
        """Atualiza um setor"""
        return self.supabase.update(self.table, setor_id, data)
    
    def delete_setor(self, setor_id: int) -> bool:
        """Deleta um setor"""
        return self.supabase.delete(self.table, setor_id)


class AuthService:
    """Serviço de Autenticação Supabase"""
    
    def __init__(self):
        self.url = os.getenv('SUPABASE_URL')
        self.key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_KEY')
        
        if not self.url or not self.key:
            raise ValueError('SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórios')
        
        self.client = create_client(self.url, self.key)
    
    def sign_in_with_password(self, email: str, password: str) -> Dict:
        """Autentica usuário com email e senha"""
        try:
            response = self.client.auth.sign_in_with_password({
                'email': email,
                'password': password
            })
            
            session = getattr(response, 'session', None) or response.get('session') if isinstance(response, dict) else None
            user = getattr(response, 'user', None) or response.get('user') if isinstance(response, dict) else None
            
            if session and user:
                return {
                    'status': 'sucesso',
                    'token': session.get('access_token') if isinstance(session, dict) else getattr(session, 'access_token', None),
                    'refresh_token': session.get('refresh_token') if isinstance(session, dict) else getattr(session, 'refresh_token', None),
                    'user_id': user.get('id') if isinstance(user, dict) else getattr(user, 'id', None),
                    'email': user.get('email') if isinstance(user, dict) else getattr(user, 'email', None)
                }
            
            error = getattr(response, 'error', None) or response.get('error') if isinstance(response, dict) else None
            if error:
                raise ValueError(str(error))
            
            raise ValueError('Falha na autenticação')
            
        except Exception as e:
            raise ValueError(f'Erro ao autenticar: {str(e)}')
    
    def sign_up(self, email: str, password: str) -> Dict:
        """Registra um novo usuário"""
        try:
            response = self.client.auth.sign_up({
                'email': email,
                'password': password
            })
            
            user = getattr(response, 'user', None) or response.get('user') if isinstance(response, dict) else None
            
            if user:
                return {
                    'status': 'sucesso',
                    'user_id': user.get('id') if isinstance(user, dict) else getattr(user, 'id', None),
                    'email': user.get('email') if isinstance(user, dict) else getattr(user, 'email', None)
                }
            
            raise ValueError('Falha no registro')
            
        except Exception as e:
            raise ValueError(f'Erro ao registrar: {str(e)}')
    
    def get_user(self, token: str) -> Dict:
        """Obtém informações do usuário a partir do token"""
        try:
            self.client.auth.set_session(token, None)
            response = self.client.auth.get_user()
            
            user = getattr(response, 'user', None) or response.get('user') if isinstance(response, dict) else None
            
            if user:
                return {
                    'id': user.get('id') if isinstance(user, dict) else getattr(user, 'id', None),
                    'email': user.get('email') if isinstance(user, dict) else getattr(user, 'email', None)
                }
            
            raise ValueError('Usuário não encontrado')
            
        except Exception as e:
            raise ValueError(f'Erro ao obter usuário: {str(e)}')
