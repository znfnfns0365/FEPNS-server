import { Router } from 'express';
import { findUser } from '../middleware/findUser.js';
import { addRelationHandler } from '../handler/relationHandler/relationAddHandler.js';
import { relationObserversHandler } from '../handler/relationHandler/relationObserversHandler.js';

const relationRouter = Router();

relationRouter.post('/add', findUser, addRelationHandler);
relationRouter.post('/observers', findUser, relationObserversHandler);

export default relationRouter;
