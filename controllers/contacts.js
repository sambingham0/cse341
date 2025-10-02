exports.getContacts = async (req, res) => {
  try {
    const db = req.app.locals.db || req.app.get('db');
    if (!db) {
      return res.status(503).json({ error: 'Database not connected.' });
    }
    const contacts = await db.collection('contacts').find({}).toArray();
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ error: 'No contact data found.' });
    }
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// GET /contact?id=123
exports.getContactById = async (req, res) => {
  try {
    const db = req.app.locals.db || req.app.get('db');
    if (!db) {
      return res.status(503).json({ error: 'Database not connected.' });
    }
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: 'Missing id query parameter.' });
    }
    const ObjectId = require('mongodb').ObjectId;
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid id format.' });
    }
    const contact = await db.collection('contacts').findOne({ _id: objectId });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found.' });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// POST /contacts
// All fields are required. Expected body: { firstName, lastName, email, favoriteColor, birthday }
exports.createContact = async (req, res) => {
  try {
    const db = req.app.locals.db || req.app.get('db');
    if (!db) {
      return res.status(503).json({ error: 'Database not connected.' });
    }

    const { firstName, lastName, email, favoriteColor, birthday } = req.body || {};
    const missing = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'].filter(
      (k) => !req.body || req.body[k] === undefined || req.body[k] === null || req.body[k] === ''
    );
    if (missing.length) {
      return res.status(400).json({ error: 'Missing required fields', missing });
    }

    const doc = { firstName, lastName, email, favoriteColor, birthday };
  const result = await db.collection('contacts').insertOne(doc);
  return res.status(201).json({ id: result.insertedId.toString() });
  } catch (err) {
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// PUT /contacts/:id
// Updates a contact. All fields are required in the payload, id is passed as URL param.
exports.updateContact = async (req, res) => {
  try {
    const db = req.app.locals.db || req.app.get('db');
    if (!db) {
      return res.status(503).json({ error: 'Database not connected.' });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter.' });
    }
    const { ObjectId } = require('mongodb');
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid id format.' });
    }

    const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];
    const missing = requiredFields.filter(
      (k) => !req.body || req.body[k] === undefined || req.body[k] === null || req.body[k] === ''
    );
    if (missing.length) {
      return res.status(400).json({ error: 'Missing required fields', missing });
    }

    const updateDoc = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };

    const result = await db
      .collection('contacts')
      .updateOne({ _id: objectId }, { $set: updateDoc });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found.' });
    }

    // No content on success
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// DELETE /contacts/:id
exports.deleteContact = async (req, res) => {
  try {
    const db = req.app.locals.db || req.app.get('db');
    if (!db) {
      return res.status(503).json({ error: 'Database not connected.' });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter.' });
    }

    const { ObjectId } = require('mongodb');
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid id format.' });
    }

    const result = await db.collection('contacts').deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found.' });
    }

    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
};