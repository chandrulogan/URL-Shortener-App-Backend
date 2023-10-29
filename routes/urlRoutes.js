const express = require('express');
const urlController = require('../controller/urlController');


const router = express.Router();

router.post('/shorten', urlController.shortenUrl);
router.get('/:shortUrl', urlController.redirectToOriginalUrl);

module.exports = router;