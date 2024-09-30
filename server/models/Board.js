import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  columns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Column',
  }],
});

export default mongoose.model('Board', BoardSchema);
