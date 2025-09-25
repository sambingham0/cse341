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

module.exports = router;