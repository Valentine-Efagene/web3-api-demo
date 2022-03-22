import userService from './user.service.js';
import debug from 'debug';

const log = debug('app:users-controller');
class UsersMiddleware {

    async validateRequiredUserBodyFields(req, res, next) {
        if (req.body && req.body.email && req.body.password) {
            next();
        } else {
            res.status(400).send({ error: `Missing required fields email and password` });
        }
    }

    async validateSameEmailDoesntExist(req, res, next) {
        const user = await userService.getUserByEmail(req.body.email);
        if (user) {
            res.status(400).send({ error: `User email already exists` });
        } else {
            next();
        }
    }

    async validateSameEmailBelongToSameUser(req, res, next) {
        const user = await userService.getUserByEmail(req.body.email);
        if (user.locals.user._id === req.params.userId) {
            next();
        } else {
            res.status(400).send({ error: `Invalid email` });
        }
    }

    // Here we need to use an arrow function to bind `this` correctly
    validatePatchEmail = async (req, res, next) => {
        if (req.body.email) {
            log('Validating email', req.body.email);

            this.validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    }

    async validateUserExists(req, res, next) {
        const user = await userService.readById(req.params.userId);
        if (user) {
            res.locals.user = user;
            next();
        } else {
            res.status(404).send({ error: `User ${req.params.userId} not found` });
        }
    }

    async extractUserId(req, res, next) {
        req.body.id = req.params.userId;
        next();
    }
}

export default new UsersMiddleware();