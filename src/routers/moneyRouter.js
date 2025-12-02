import { Router } from 'express';
import { findUser } from '../middleware/findUser.js';
import { moneyObserversHandler } from '../handler/moneyHandler/moneyObserversHandler.js';
import { moneyDetailHandler } from '../handler/moneyHandler/moneyDetailHandler.js';
import { moneyAddHandler } from '../handler/moneyHandler/moneyAddHandler.js';
import { moneyDeleteHandler } from '../handler/moneyHandler/moneyDeleteHandler.js';

const moneyRouter = Router();

moneyRouter.post('/add', findUser, moneyAddHandler);
moneyRouter.post('/observers/list', findUser, moneyObserversHandler);
moneyRouter.post('/observers/detail', findUser, moneyDetailHandler);
moneyRouter.post('/observers/delete', findUser, moneyDeleteHandler);

export default moneyRouter;
