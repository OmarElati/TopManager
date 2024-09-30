// models/Column.js
import mongoose from 'mongoose';

const ColumnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    // enum: ["todo", "in progress", "completed"],
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tasks',
  }],
});

export default mongoose.model('Column', ColumnSchema);
