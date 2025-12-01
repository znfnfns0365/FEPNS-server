import { Router } from 'express';
import { findUser } from '../middleware/findUser.js';
import { eventCreateHandler } from '../handler/eventHandler/eventCreateHandler.js';

const eventRouter = Router();

eventRouter.post('/add', findUser, eventCreateHandler);

export default eventRouter;
