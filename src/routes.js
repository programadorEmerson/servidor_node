import { Router } from 'express';
import Usuario from './controllers/Usuario';
import Empresa from './controllers/Empresa_Controller';

const routes = new Router();

routes.post('/', Usuario.setUsuario);
routes.post('/create/user', Usuario.criarUsuario);
routes.post('/create/empresa', Empresa.criarEmpresa);

export default routes;
