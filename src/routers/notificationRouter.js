import { Router } from 'express';
import { findUser } from '../middleware/findUser.js';
import { notificationViewHandler } from '../handler/notificationHandler/notificationViewHandler.js';
import { notificationNextHandler } from '../handler/notificationHandler/notificationNextHandler.js';
import { notificationPrevHandler } from '../handler/notificationHandler/notificationPrevHandler.js';

const notificationRouter = Router();

notificationRouter.post('/', findUser, notificationViewHandler);
notificationRouter.post('/next', findUser, notificationNextHandler);
notificationRouter.post('/prev', findUser, notificationPrevHandler);

export default notificationRouter;

