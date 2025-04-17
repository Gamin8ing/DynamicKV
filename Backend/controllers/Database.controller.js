const databaseService = require('../services/Database.service');
const { validationResult } = require('express-validator');
const userModel = require('../models/User.model');

module.exports.createDatabase = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { dbName, dbType, dbSize } = req.body;
    const userId = req.user._id;
    try {
        const database = await databaseService.createDatabase({
            dbName,
            dbType,
            dbSize,
            userId
        });
        res.status(201).json(database);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.getDatabase = async (req, res) => {
    const { dbName } = req.params;
    try {
        const database = await databaseService.getDatabase(dbName);
        res.status(200).json(database);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.updateDatabase = async (req, res) => {
    const { dbName } = req.params;
    const updateData = req.body;
    try {
        const database = await databaseService.updateDatabase(dbName, updateData);
        res.status(200).json(database);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.deleteDatabase = async (req, res) => {
    const { dbName } = req.params;
    try {
        const database = await databaseService.deleteDatabase(dbName);
        res.status(200).json(database);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.getAllDatabases = async (req, res) => {
    try {
        const databases = await databaseService.getAllDatabases();
        res.status(200).json(databases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}