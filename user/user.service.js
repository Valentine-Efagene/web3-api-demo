import UsersDao from './user.dao.js';

class UsersService {
    async create(resource) {
        return UsersDao.addUser(resource);
    }

    async deleteById(id) {
        return UsersDao.removeUserById(id);
    }

    async list(limit, page) {
        return UsersDao.getUsers(limit, page);
    }

    async patchById(id, resource) {
        return UsersDao.updateUserById(id, resource);
    }

    async readById(id) {
        return UsersDao.getUserById(id);
    }

    async putById(id, resource) {
        return UsersDao.updateUserById(id, resource);
    }

    async getUserByEmail(email) {
        return UsersDao.getUserByEmail(email);
    }

    async getUserByEmailWithPassword(email) {
        return UsersDao.getUserByEmailWithPassword(email);
    }
}

export default new UsersService();