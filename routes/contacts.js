const express = require('express');
const router = express.Router();
const controller = require('../controllers/contacts');

/**
 * @swagger
 * /contacts:
 *   get:
 *     description: Get all contacts or a specific contact by ID using query parameter
 *     parameters:
 *       - name: id
 *         in: query
 *         type: string
 *         description: Optional contact ID to retrieve a specific contact
 *     responses:
 *       200:
 *         description: Successfully retrieved contact(s)
 *       204:
 *         description: No contacts found
 */


// GET /contacts optional query param id
router.get('/', (req, res, next) => {
	if (req.query.id) {
		require('../controllers/contacts').getContactById(req, res, next);
	} else {
		require('../controllers/contacts').getContacts(req, res, next);
	}
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     description: Create a new contact
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Contact information to create
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: "John"
 *             lastName:
 *               type: string
 *               example: "Doe"
 *             email:
 *               type: string
 *               example: "john.doe@email.com"
 *             favoriteColor:
 *               type: string
 *               example: "Blue"
 *             birthday:
 *               type: string
 *               example: "1990-05-15"
 *     responses:
 *       201:
 *         description: Contact successfully created
 *       400:
 *         description: Invalid request body or missing required fields
 */
// POST /contacts - create a new contact
router.post('/', controller.createContact);

// PUT /contacts/:id - update an existing contact
router.put('/:id', controller.updateContact);

// DELETE /contacts/:id - delete a contact
router.delete('/:id', controller.deleteContact);

module.exports = router;