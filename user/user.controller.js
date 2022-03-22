import usersService from './user.service.js';
import argon2 from 'argon2';
import debug from 'debug';

const log = debug('app:users-controller');
class UsersController {

    async listUsers(req, res) {
        const users = await usersService.list(100, 0);
        res.status(200).send(users);
    }

    async getUserById(req, res) {
        const user = await usersService.readById(req.params.userId);
        res.status(200).send(user);
    }

    async createUser(req, res, next) {
        req.body.password = await argon2.hash(req.body.password);
        const userId = await usersService.create(req.body);

        if (next) {
            next()
        } else {
            res.status(201).send({ id: userId })
        }
    }

    async patch(req, res) {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        }
        log(await usersService.patchById(req.params.userId, req.body));
        res.status(204).send(``);
    }

    async put(req, res) {
        req.body.password = await argon2.hash(req.body.password);
        log(await usersService.patchById(req.params.userId, req.body));
        res.status(204).send(``);
    }

    async removeUser(req, res) {
        log(await usersService.deleteById(req.params.userId));
        res.status(204).send(``);
    }

    async updatePermissionFlags(req, res) {
        const patchUserDto = {
            permissionFlags: parseInt(req.params.permissionFlags),
        };
        log(await usersService.patchById(req.body.id, patchUserDto));
        res.status(204).send();
    }
}

export default new UsersController();