import shortid from "shortid";
import debug from "debug";
import mongooseService from '../common/service/mongoose.service.js';
import ModelName from '../common/enum/model.name.enum.js';

const log = debug('app:in-memory-dao')

class ContactsDao {
    Schema = mongooseService.getMongoose().Schema
    contactSchema = new this.Schema({
        _id: String,
        name: String,
        phone: String
    }, { id: false })
    Contact = mongooseService.getMongoose().model(ModelName.CONTACT, this.contactSchema)

    constructor() {
        log('Created new instance of ContactsDao');
    }

    async addContact(contactFields) {
        const contactId = shortid.generate();
        const contact = new this.Contact({
            _id: contactId,
            ...contactFields
        })
        await contact.save()
        return contact
    }

    async getContactByPhone(phone) {
        console.log(phone)
        return this.Contact.findOne({ phone }).exec()
    }

    async getContactById(contactId) {
        return this.Contact.findOne({ _id: contactId }).populate(ModelName.CONTACT).exec()
    }

    async getContacts(limit = 25, page = 0) {
        return this.Contact.find()
            .limit(limit)
            .skip(limit * page)
            .exec()
    }

    async updateContactById(
        contactId,
        contactFields
    ) {
        const existingContact = await this.Contact.findOneAndUpdate(
            { _id: contactId },
            { $set: contactFields },
            { new: true }
        )

        return existingContact
    }

    async removeContactById(contactId) {
        return this.Contact.deleteOne({ _id: contactId }).exec()
    }
}

export default new ContactsDao();