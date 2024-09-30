import mongoose from 'mongoose';

const tasksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    columnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column',
        required: true
    },
    stage: {
        type: String,
        default: 'todo'
    }
});

const Tasks = mongoose.model('Tasks', tasksSchema);
export default Tasks;
