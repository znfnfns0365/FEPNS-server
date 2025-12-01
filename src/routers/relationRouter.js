import { Router } from 'express';
import { findUser } from '../middleware/findUser.js';
import { addRelationHandler } from '../handler/relationHandler/relationAddHandler.js';
import { relationObserversHandler } from '../handler/relationHandler/relationObserversHandler.js';
import { relationCuriousAboutMeHandler } from '../handler/relationHandler/relationCuriousAboutMeHandler.js';
import { deleteRelationHandler } from '../handler/relationHandler/relationDeleteHandler.js';

const relationRouter = Router();

relationRouter.post('/add', findUser, addRelationHandler);
relationRouter.post('/observers', findUser, relationObserversHandler);
relationRouter.post('/delete', findUser, deleteRelationHandler);

export default relationRouter;
