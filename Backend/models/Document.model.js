const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  collectionId: {
        type: mongoose.Schema.Types.ObjectId, 
        // type will take reference from Collection
        // matlab har collection mai document hoga
        ref: 'Collection', 
        required: true 
    },
  data: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true 
    },
  createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Document', documentSchema);