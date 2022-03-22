import PermissionFlag from '../enum/permissionflag.enum.js';
import debug from 'debug';

const log = debug('app:common-permission-middleware');

class PermissionMiddleware {
  permissionFlagRequired(requiredPermissionFlag) {
    return (req, res, next) => {
      try {
        const userPermissionFlags = parseInt(
          res.locals.jwt.permissionFlags
        )
        log('my required permission flag: ', requiredPermissionFlag)
        log('my required permission: ', res.locals.jwt.permissionFlags)
        if (userPermissionFlags & requiredPermissionFlag) {
          next()
        } else {
          res.status(403).send('You do not have the required permission');
        }
      } catch (e) {
        log(e)
      }
    };
  }

  async onlySameUserOrAdminCanDoThisAction(req, res, next) {
    const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags);
    if (
      req.params &&
      req.params.userId &&
      req.params.userId === res.locals.jwt.userId
    ) {
      return next();
    } else {
      if (userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) {
        return next();
      } else {
        return res.status(403).send();
      }
    }
  }

  async userCantChangePermission(req, res, next) {
    if (
      'permissionFlags' in req.body &&
      req.body.permissionFlags !== res.locals.user.permissionFlags
    ) {
      res.status(400).send({
        errors: ['User cannot change permission flags'],
      });
    } else {
      next();
    }
  }
}

export default new PermissionMiddleware()