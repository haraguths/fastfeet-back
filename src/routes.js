import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import EntregadorController from './app/controllers/EntregadorController';
import SignatureController from './app/controllers/SignatureController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.post('/users', UserController.store);
routes.put('/users', authMiddleware, UserController.update);

// recipients -> destinatários
routes.put('/recipients', authMiddleware, RecipientController.update);
routes.post('/recipients', authMiddleware, RecipientController.store);
routes.put('/recipients', authMiddleware, RecipientController.update);

// files -> avatar
routes.post('/files', upload.single('file'), FileController.store);

// signature -> assinatura
routes.post('/signature', upload.single('file'), SignatureController.store);

// Entregadores
routes.post('/entregadores', authMiddleware, EntregadorController.store);
routes.get('/entregadores', authMiddleware, EntregadorController.index);
routes.put('/entregadores', authMiddleware, EntregadorController.update);
routes.delete('/entregadores/:id', authMiddleware, EntregadorController.delete);


export default routes;
