import { Router } from 'express';
import Empresa from './controllers/Empresa_Controller';

const routes = new Router();

// Métodos Post
routes.post('/empresa/criar', Empresa.criarEmpresa);

// Métodos Put
routes.put('/empresa/atualizar', Empresa.atualizarEmpresa);

export default routes;
