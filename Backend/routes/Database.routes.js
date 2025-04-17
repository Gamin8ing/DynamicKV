const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const databaseController = require('../controllers/Database.controller');


router.post('/create', databaseController.createDatabase);
router.get('/user/:userId', databaseController.getDatabase);
router.delete('/:id', databaseController.deleteDatabase);
router.patch('/:id', databaseController.updateDatabase);
router.get('/', databaseController.getAllDatabases);

module.exports = router;