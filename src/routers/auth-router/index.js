import Router from 'express'
import { body } from "express-validator";
import AuthController from '../../controllers/AuthController.js';

const authRouter = new Router();

authRouter.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 32}),
  AuthController.registration)

authRouter.post('/login', AuthController.login);
authRouter.post('/managers/verify', AuthController.verifyManager);

export default authRouter;