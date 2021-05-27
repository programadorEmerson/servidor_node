import { Router } from 'express';
import Usuario from './controllers/Usuario';

const routes = new Router();

routes.post('/', Usuario.setUsuario);
routes.post('/create/user', Usuario.criarUsuario);

export default routes;
