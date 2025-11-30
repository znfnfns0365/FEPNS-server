import { Router } from 'express';
import { userRegisterHandler } from '../handler/userRegisterHandler.js';
import { userLookUpHandler } from '../handler/userLookUpHandler.js';
import { findUser } from '../middleware/findUser.js';

const userRouter = Router();

userRouter.post('/lookup', findUser, userLookUpHandler);
userRouter.post('/register', userRegisterHandler);

export default userRouter;
