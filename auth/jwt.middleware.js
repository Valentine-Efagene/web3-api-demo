import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import usersService from '../user/user.service.js'
import debug from 'debug'

const log = debug('app:in-memory-jwt-middleware')

const jwtSecret = process.env.JWT_SECRET || 'alohamora'

class JwtMiddleware {
  verifyRefreshBodyField(req, res, next) {
    if (req.body && req.body.refreshToken) {
      return next();
    } else {
      return res
        .status(400)
        .send({ errors: ['Missing required field: refreshToken'] });
    }
  }

  async validRefreshNeeded(req, res, next) {
    const user = await usersService.getUserByEmailWithPassword(
      res.locals.jwt.email
    );
    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data)
    );
    const hash = crypto
      .createHmac('sha512', salt)
      .update(res.locals.jwt.userId + jwtSecret)
      .digest('base64');
    if (hash === req.body.refreshToken) {
      req.body = {
        userId: user._id,
        email: user.email,
        permissionFlags: user.permissionFlags,
      };
      return next();
    } else {
      return res.status(400).send({ errors: ['Invalid refresh token'] });
    }
  }

  validJWTNeeded(req, res, next) {
    if (req.headers['authorization']) {
      try {
        const authorization = req.headers['authorization'].split(' ');
        if (authorization[0] !== 'Bearer') {
          return res.status(401).send();
        } else {
          log("My jwt secret", jwtSecret)
          res.locals.jwt = jwt.verify(
            authorization[1],
            jwtSecret
          );
          log('my jwt result', res.locals.jwt)
          next();
        }
      } catch (err) {
        log('my jwt error', err)
        return res.status(403).send('Token Error')
      }
    } else {
      return res.status(401).send()
    }
  }
}

export default new JwtMiddleware()