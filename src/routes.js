import { Router } from 'express';
import Empresa from './controllers/Empresa_Controller';
import Usuario from './controllers/Usuario_Controller';
import Produto from './controllers/Produto_Controller';

const routes = new Router();

// Opções Produto
routes.get('/produto/listar', Produto.listarProdutos);
routes.post('/produto/novo', Produto.cadastrarProduto);
routes.put('/produto/atualizar', Produto.atualizarProduto);
routes.delete('/produto/deletar', Produto.deletarProduto);

// Opções dos usuários
routes.get('/empresa/listar/usuarios', Usuario.listarUsuario);
routes.post('/empresa/adicionar/usuario', Empresa.adicionarUsuario);
routes.put('/empresa/atualizar/usuario', Usuario.atualizarUsuario);
routes.delete('/empresa/deletar/usuario', Usuario.deletarUsuario);

// Opções dos emails
routes.get('/empresa/listar/emails', Empresa.listarEmails);
routes.post('/empresa/adicionar/email', Empresa.adicionarEmail);
routes.put('/empresa/atualizar/email', Empresa.atualizarEmail);
routes.delete('/empresa/deletar/email', Empresa.deletarEmail);

// Opções dos telefones
routes.get('/empresa/listar/telefones', Empresa.listarTelefones);
routes.post('/empresa/adicionar/telefone', Empresa.adicionarTelefone);
routes.put('/empresa/atualizar/telefone', Empresa.atualizarTelefone);
routes.delete('/empresa/deletar/telefone', Empresa.deletarTelefone);

// Opções do cadastro
routes.get('/empresa/dados/cadastrais', Empresa.dadosCadastrais);
routes.put('/empresa/atualizar/cadastro', Empresa.atualizarCadastro);

// Opções do plano
routes.get('/empresa/plano/contratado', Empresa.planoContratado);
routes.put('/empresa/atualizar/plano', Empresa.atualizarPlano);

// Gerenciar chave de acesso
routes.get('/empresa/chave/atual', Empresa.chaveAtual);
routes.post('/empresa/adicionar/chave', Empresa.adicionarChave);
routes.get('/empresa/chaves/utilizadas', Empresa.chavesUtilizadas);

// Criar nova empresa cliente - Completo
routes.post('/empresa/criar', Empresa.criarEmpresa);

// Rota inicial
routes.get('/', Empresa.initialRout);

export default routes;
