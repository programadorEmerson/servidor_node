import { Router } from 'express';
import Empresa from './controllers/Empresa_Controller';
import Usuario from './controllers/Usuario_Controller';

const routes = new Router();

// Criar nova empresa cliente
routes.post('/empresa/criar', Empresa.criarEmpresa);

// Resgatar dados da Empresa - Completo
routes.get('/empresa/chaves/utilizadas', Empresa.chavesUtilizadas);
routes.get('/empresa/listar/emails', Empresa.listarEmails);
routes.get('/empresa/listar/telefones', Empresa.listarTelefones);
routes.get('/empresa/listar/usuarios', Usuario.listarUsuario);
routes.get('/empresa/chave/atual', Empresa.chaveAtual);
routes.get('/empresa/dados/cadastrais', Empresa.dadosCadastrais);
routes.get('/empresa/plano/contratado', Empresa.planoContratado);

// Deletar dados da empresa - Completo
routes.delete('/empresa/deletar/email', Empresa.deletarEmail);
routes.delete('/empresa/deletar/telefone', Empresa.deletarTelefone);
routes.delete('/empresa/deletar/usuario', Usuario.deletarUsuario);

// Atualizar dados da empresa
routes.put('/empresa/atualizar/plano', Empresa.atualizarPlano);

export default routes;
