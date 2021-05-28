import { Router } from 'express';
import Usuario from './controllers/Usuario_Controller';
import Empresa from './controllers/Empresa_Controller';

const routes = new Router();

routes.post('/', Usuario.setUsuario);
routes.post('/create/user', Usuario.criarUsuario);
routes.post('/create/empresa', Empresa.criarEmpresa);

routes.delete('/deletar/user', Usuario.deletarUsuario);

export default routes;
