const mongoose = require('mongoose');

const databaseSchema = new mongoose.Schema({
  name: { 
        type: String, 
        required: true 
    },
  createdAt: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model('Database', databaseSchema);
