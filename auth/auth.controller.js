import debug from 'debug';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const log = debug('app:auth-controller');

const jwtSecret = process.env.JWT_SECRET || 'alohamora';
const tokenExpirationInSeconds = 36000;

class AuthController {
  async createJWT(req, res) {
    try {
      const refreshId = req.body.userId + jwtSecret;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));
      const hash = crypto
        .createHmac('sha512', salt)
        .update(refreshId)
        .digest('base64');
      req.body.refreshKey = salt.export();
      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: tokenExpirationInSeconds,
      });
      return res
        .status(201)
        .send({ accessToken: token, refreshToken: hash, userId: req.body.userId });
    } catch (err) {
      log('createJWT error: %O', err);
      return res.status(500).send();
    }
  }
}

export default new AuthController();