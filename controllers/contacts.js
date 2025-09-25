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