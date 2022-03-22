import ContactsDao from './contact.dao.js';
import contactWeb3Dao from './contact.web3.dao.js';

class ContactsService {
    async create(resource) {
        return ContactsDao.addContact(resource);
    }

    async deleteById(id) {
        return ContactsDao.removeContactById(id);
    }

    async list(limit, page) {
        return ContactsDao.getContacts(limit, page);
    }

    async listWeb3() {
        return contactWeb3Dao.getContacts()
    }

    async patchById(id, resource) {
        return ContactsDao.updateContactById(id, resource);
    }

    async readById(id) {
        return ContactsDao.getContactById(id);
    }

    async putById(id, resource) {
        return ContactsDao.updateContactById(id, resource);
    }

    async getContactByPhone(phone) {
        return ContactsDao.getContactByPhone(phone);
    }
}

export default new ContactsService();