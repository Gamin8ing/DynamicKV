const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  databaseId: {
      type: mongoose.Schema.Types.ObjectId,//type will take refrence from Database
      // matlab har database mai collection hoga
      ref: 'Database', 
      required: true 
  },
  name: {
      type: String, required: true 
  },
  createdAt: {
      type: Date, default: Date.now 
  }
});

module.exports = mongoose.model('Collection', collectionSchema);
