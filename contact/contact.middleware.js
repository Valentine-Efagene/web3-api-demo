import contactService from './contact.service.js';
// import debug from 'debug';

// const log = debug('app:contacts-controller');
class ContactsMiddleware {

    async validateRequiredContactBodyFields(req, res, next) {
        if (req.body && req.body.name && req.body.phone) {
            next();
        } else {
            res.status(400).send({ error: `Missing required fields email and password` });
        }
    }

    async validateSamePhoneBelongToSameContact(req, res, next) {
        const contact = await contactService.getContactByPhone(req.body.phone);
        if (contact.locals.contact._id === req.params.contactId) {
            next();
        } else {
            res.status(400).send({ error: `Invalid email` });
        }
    }

    async validateContactExists(req, res, next) {
        const contact = await contactService.readById(req.params.contactId);
        if (contact) {
            res.locals.contact = contact;
            next();
        } else {
            res.status(404).send({ error: `Contact ${req.params.contactId} not found` });
        }
    }

    async extractContactId(req, res, next) {
        req.body.id = req.params.contactId;
        next();
    }
}

export default new ContactsMiddleware();