import { Router } from 'express';
import { userRegisterHandler } from '../handler/userHandler/userRegisterHandler.js';
import { userLookUpHandler } from '../handler/userHandler/userLookUpHandler.js';
import { findUser } from '../middleware/findUser.js';

const userRouter = Router();

userRouter.post('/lookup', findUser, userLookUpHandler);
userRouter.post('/register', userRegisterHandler);

export default userRouter;
