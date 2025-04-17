const databaseModel = require('../models/Database.model');
const userModel = require('../models/User.model');
const mongoose = require('mongoose');

module.exports.createDatabase = async ({
    dbName, dbType, dbSize, userId
}) => {
    if (!dbName || !dbType || !dbSize || !userId) {
        throw new Error('All fields are required');
    }
    const database = await databaseModel.create({
        dbName,
        dbType,
        dbSize,
        userId,
    });
    return database;
}
module.exports.getDatabase = async (dbName) => {
    if (!dbName) {
        throw new Error('Database name is required');
    }
    const database = await databaseModel.findOne({ dbName });
    if (!database) {
        throw new Error('Database not found');
    }
    return database;
}
module.exports.updateDatabase = async (dbName, updateData) => {
    if (!dbName || !updateData) {
        throw new Error('Database name and update data are required');
    }
    const database = await databaseModel.findOneAndUpdate({ dbName }, updateData, { new: true });
    if (!database) {
        throw new Error('Database not found');
    }
    return database;
}
module.exports.deleteDatabase = async (dbName) => {
    if (!dbName) {
        throw new Error('Database name is required');
    }
    const database = await databaseModel.findOneAndDelete({ dbName });
    if (!database) {
        throw new Error('Database not found');
    }
    return database;
}
module.exports.getAllDatabases = async () => {
    const databases = await databaseModel.find();
    return databases;
}