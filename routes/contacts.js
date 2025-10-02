const express = require('express');
const router = express.Router();
const controller = require('../controllers/contacts');


// GET /contacts optional query param id
router.get('/', (req, res, next) => {
	if (req.query.id) {
		require('../controllers/contacts').getContactById(req, res, next);
	} else {
		require('../controllers/contacts').getContacts(req, res, next);
	}
});

// POST /contacts - create a new contact
router.post('/', controller.createContact);

// PUT /contacts/:id - update an existing contact
router.put('/:id', controller.updateContact);

// DELETE /contacts/:id - delete a contact
router.delete('/:id', controller.deleteContact);

module.exports = router;