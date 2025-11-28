import { Router } from 'express';
import { userRegisterHandler } from '../handler/userRegisterHandler.js';

const userRegisterRouter = Router();

userRegisterRouter.post('/', userRegisterHandler);

export default userRegisterRouter;
