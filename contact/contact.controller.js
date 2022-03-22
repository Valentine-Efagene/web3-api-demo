import contactsService from './contact.service.js';
import argon2 from 'argon2';
import debug from 'debug';

const log = debug('app:contacts-controller');
class ContactsController {

    async listContacts(req, res) {
        const contacts = await contactsService.list(100, 0);
        res.status(200).send(contacts);
    }

    async listWeb3Contacts(req, res) {
        const contacts = await contactsService.listWeb3();
        res.status(200).send(contacts);
    }

    async getContactById(req, res) {
        const contact = await contactsService.readById(req.params.contactId);
        res.status(200).send(contact);
    }

    async createContact(req, res) {
        const contact = await contactsService.create(req.body);
        res.status(201).send(contact)
    }

    async patch(req, res) {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        }
        log(await contactsService.patchById(req.params.contactId, req.body));
        res.status(204).send(``);
    }

    async put(req, res) {
        req.body.password = await argon2.hash(req.body.password);
        log(await contactsService.patchById(req.params.contactId, req.body));
        res.status(204).send(``);
    }

    async removeContact(req, res) {
        log(await contactsService.deleteById(req.params.contactId));
        res.status(204).send(``);
    }

    async updatePermissionFlags(req, res) {
        const patchContactDto = {
            permissionFlags: parseInt(req.params.permissionFlags),
        };
        log(await contactsService.patchById(req.body.id, patchContactDto));
        res.status(204).send();
    }
}

export default new ContactsController();