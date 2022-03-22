import shortid from "shortid";
import debug from "debug";
import mongooseService from '../common/service/mongoose.service.js';
import PermissionFlag from '../common/enum/permissionflag.enum.js';
import ModelName from '../common/enum/model.name.enum.js';

const log = debug('app:in-memory-dao')

class UsersDao {
    Schema = mongooseService.getMongoose().Schema
    userSchema = new this.Schema({
        _id: String,
        email: String,
        password: { type: String, select: false },
        firstName: String,
        lastName: String,
        permissionFlags: Number,
    }, { id: false })
    User = mongooseService.getMongoose().model(ModelName.USER, this.userSchema)

    constructor() {
        log('Created new instance of UsersDao');
    }

    async addUser(userFields) {
        const userId = shortid.generate();
        const user = new this.User({
            _id: userId,
            ...userFields,
            permissionFlags: PermissionFlag.FREE_PERMISSION
        })
        await user.save()
        return userId
        // return user
    }

    async getUserByEmail(email) {
        console.log(email)
        return this.User.findOne({ email }).exec()
    }

    async getUserById(userId) {
        return this.User.findOne({ _id: userId }).populate(ModelName.USER).exec()
    }

    async getUsers(limit = 25, page = 0) {
        return this.User.find()
            .limit(limit)
            .skip(limit * page)
            .exec()
    }

    async updateUserById(
        userId,
        userFields
    ) {
        const existingUser = await this.User.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true }
        )

        return existingUser
    }

    async removeUserById(userId) {
        return this.User.deleteOne({ _id: userId }).exec()
    }

    async getUserByEmailWithPassword(email) {
        return this.User.findOne({ email })
            .select('_id email permissionFlags +password')
            .exec();
    }
}

export default new UsersDao();