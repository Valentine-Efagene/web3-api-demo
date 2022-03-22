import { body } from 'express-validator'

import { CommonRoutesConfig } from '../common/route/common.routes.config.js'
import UsersController from './user.controller.js'
import UsersMiddleware from './user.middleware.js'
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware.js'

import jwtMiddleware from '../auth/jwt.middleware.js';
import permissionMiddleware from '../common/middleware/permission.middleware.js';
import PermissionFlag from '../common/enum/permissionflag.enum.js';
import authController from '../auth/auth.controller.js'

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app) {
    super(app, 'UsersRoutes')
  }

  configureRoutes() {
    this.app.route(`/users`)
      .get(
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.permissionFlagRequired(
          PermissionFlag.ADMIN_PERMISSION
        ),
        UsersController.listUsers
      )
      .post(
        body('email').isEmail(),
        body('password')
          .isLength({ min: 5 })
          .withMessage('Must include password (5+ characters)'),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateRequiredUserBodyFields,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser,
        authController.createJWT);

    this.app.param(`userId`, UsersMiddleware.extractUserId)
    this.app.route(`/users/:userId`)
      .all(
        UsersMiddleware.validateUserExists,
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.onlySameUserOrAdminCanDoThisAction
      )
      .get(UsersController.getUserById)
      .delete(UsersController.removeUser)

    this.app.put(`/users/:userId`, [
      body('email').isEmail(),
      body('password').isLength({ min: 5 })
        .withMessage('Must include password (5+ characters)'),
      body('firstName').isString(),
      body('lastName').isString(),
      body('permissionFlags').isInt(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validateSameEmailBelongToSameUser,
      UsersMiddleware.validateRequiredUserBodyFields,
      UsersMiddleware.validateSameEmailBelongToSameUser,
      UsersController.put
    ])

    this.app.patch(`/users/:userId`, [
      body('email').isEmail().optional(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be 5+ characters')
        .optional(),
      body('firstName').isString().optional(),
      body('lastName').isString().optional(),
      body('permissionFlags').isInt().optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      UsersMiddleware.validatePatchEmail,
      UsersController.patch
    ])

    this.app.put(`/users/:userId/permissionFlags/:permissionFlags`, [
      jwtMiddleware.validJWTNeeded,
      permissionMiddleware.onlySameUserOrAdminCanDoThisAction,

      // Note: The above two pieces of middleware are needed despite
      // the reference to them in the .all() call, because that only covers
      // /users/:userId, not anything beneath it in the hierarchy

      permissionMiddleware.permissionFlagRequired(
        PermissionFlag.FREE_PERMISSION
      ),
      UsersController.updatePermissionFlags,
    ])

    return this.app;
  }
}