import { Router } from 'express';
import Usuario from './controllers/Usuario';

const routes = new Router();

routes.get('/', Usuario.setUsuario);

export default routes;
