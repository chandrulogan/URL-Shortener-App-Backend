const express = require('express');
const main = require('../controller/main');

const router = express.Router();

router.get('/:userId', main.getUrlsByUserId);
router.get('/urls/:urlId', main.getDataByObject);
router.post('/urls/update/:urlId', main.updateDataById);
router.delete('/urls/delete/:urlId', main.deleteDataById);

module.exports = router;
