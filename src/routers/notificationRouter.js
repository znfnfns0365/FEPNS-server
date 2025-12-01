import { Router } from 'express';
import { findUser } from '../middleware/findUser.js';
import { notificationViewHandler } from '../handler/notificationHandler/notificationViewHandler.js';
import { notificationNextHandler } from '../handler/notificationHandler/notificationNextHandler.js';
import { notificationPrevHandler } from '../handler/notificationHandler/notificationPrevHandler.js';
import { notificationDeleteHandler } from '../handler/notificationHandler/notificationDeleteHandler.js';

const notificationRouter = Router();

notificationRouter.post('/delete', findUser, notificationDeleteHandler);
notificationRouter.post('/observers', findUser, notificationViewHandler);
notificationRouter.post('/observers/next', findUser, notificationNextHandler);
notificationRouter.post('/observers/prev', findUser, notificationPrevHandler);

export default notificationRouter;
