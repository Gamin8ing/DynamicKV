const mongoose = require('mongoose');

const databaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = mongoose.model('Database', databaseSchema);
