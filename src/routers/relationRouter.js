import { Router } from 'express';
import { findUser } from '../middleware/findUser.js';
import { addRelationHandler } from '../handler/relationHandler/relationAddHandler.js';

const relationRouter = Router();

relationRouter.post('/add', findUser, addRelationHandler);

export default relationRouter;
