import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import SignatureController from './app/controllers/SignatureController';
import EncomendasController from './app/controllers/EncomendasController';

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
routes.post('/deliveryman', authMiddleware, DeliverymanController.store);
routes.get('/deliveryman', authMiddleware, DeliverymanController.index);
routes.put('/deliveryman', authMiddleware, DeliverymanController.update);
routes.delete('/deliveryman/:id', authMiddleware, DeliverymanController.delete);

// Entregadores free
routes.get('/deliveryman/:id/deliveries', DeliverymanController.deliveries);
routes.get('/deliveryman/:id/delivered', DeliverymanController.delivered);

// Encomendas
routes.post('/encomendas', authMiddleware, EncomendasController.store);
routes.get('/encomendas', authMiddleware, EncomendasController.index);
routes.put('/encomendas', authMiddleware, EncomendasController.update);
routes.delete('/encomendas/:id', authMiddleware, EncomendasController.delete);

export default routes;
