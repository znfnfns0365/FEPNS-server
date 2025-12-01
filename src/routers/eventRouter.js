import { Router } from 'express';
import { findUser } from '../middleware/findUser.js';
import { eventCreateHandler } from '../handler/eventHandler/eventCreateHandler.js';
import { eventViewHandler } from '../handler/eventHandler/eventViewHandler.js';
import { eventNextHandler } from '../handler/eventHandler/eventNextHandler.js';
import { eventPrevHandler } from '../handler/eventHandler/eventPrevHandler.js';

const eventRouter = Router();

eventRouter.post('/add', findUser, eventCreateHandler);
eventRouter.post('/observers', findUser, eventViewHandler);
eventRouter.post('/observers/next', findUser, eventNextHandler);
eventRouter.post('/observers/prev', findUser, eventPrevHandler);

export default eventRouter;
