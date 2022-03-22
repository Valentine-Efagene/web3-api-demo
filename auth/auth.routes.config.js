import { body } from 'express-validator';

import jwtMiddleware from './jwt.middleware.js';
import { CommonRoutesConfig } from '../common/route/common.routes.config.js';
import authController from './auth.controller.js';
import authMiddleware from './auth.middleware.js';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware.js';

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app) {
    super(app, 'AuthRoutes');
  }

  configureRoutes() {
    this.app.post(`/auth`, [
      body('email').isEmail(),
      body('password').isString(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      authMiddleware.verifyUserPassword,
      authController.createJWT,
    ]);

    this.app.post(`/auth/refresh-token`, [
      jwtMiddleware.validJWTNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      authController.createJWT,
    ]);
    return this.app;
  }
}