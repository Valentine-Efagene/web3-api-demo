import { body } from 'express-validator'

import ContactsController from './contact.controller.js'
import ContactsMiddleware from './contact.middleware.js'
import { CommonRoutesConfig } from '../common/route/common.routes.config.js'
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware.js'

// import jwtMiddleware from '../auth/jwt.middleware.js';
// import permissionMiddleware from '../common/middleware/permission.middleware.js';
// import PermissionFlag from '../common/enum/permissionflag.enum.js';
// import authController from '../auth/auth.controller.js'

export class ContactRoutes extends CommonRoutesConfig {
  constructor(app) {
    super(app, 'ContactsRoutes')
  }

  configureRoutes() {
    this.app.route(`/contacts`)
      .get(
        // jwtMiddleware.validJWTNeeded,
        // permissionMiddleware.permissionFlagRequired(PermissionFlag.ADMIN_PERMISSION),
        //ContactsController.listContacts
        ContactsController.listWeb3Contacts
      )
      .post(
        body('name').isString(),
        body('phone')
          .isLength({ min: 8 })
          .withMessage('Must include phone number (8+ characters)'),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        ContactsMiddleware.validateRequiredContactBodyFields,
        ContactsController.createContact);

    this.app.param(`contactId`, ContactsMiddleware.extractContactId)
    this.app.route(`/contacts/:contactId`)
      .all(
        ContactsMiddleware.validateContactExists,
        // jwtMiddleware.validJWTNeeded,
        // permissionMiddleware.onlySameContactOrAdminCanDoThisAction
      )
      .get(ContactsController.getContactById)
      .delete(ContactsController.removeContact)

    this.app.put(`/contacts/:contactId`, [
      body('email').isEmail(),
      body('password').isLength({ min: 5 })
        .withMessage('Must include password (5+ characters)'),
      body('firstName').isString(),
      body('lastName').isString(),
      body('permissionFlags').isInt(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      // ContactsMiddleware.validateSameEmailBelongToSameContact,
      // ContactsMiddleware.validateRequiredContactBodyFields,
      // ContactsMiddleware.validateSameEmailBelongToSameContact,
      ContactsController.put
    ])

    this.app.patch(`/contacts/:contactId`, [
      body('email').isEmail().optional(),
      body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be 5+ characters')
        .optional(),
      body('firstName').isString().optional(),
      body('lastName').isString().optional(),
      body('permissionFlags').isInt().optional(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      // ContactsMiddleware.validatePatchEmail,
      ContactsController.patch
    ])

    return this.app;
  }
}