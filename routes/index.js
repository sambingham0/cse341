const express = require('express');
const router = express.Router();
const controller = require('../controllers');

router.get('/', controller.getName);

module.exports = router;