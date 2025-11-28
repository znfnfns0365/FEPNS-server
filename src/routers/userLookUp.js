import { Router } from 'express';
import userLookUpHandler from '../handler/userLookUpHandler.js';

const userLookUpRouter = Router();

userLookUpRouter.post('/', userLookUpHandler);

export default userLookUpRouter;
