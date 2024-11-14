import mongoose, {Schema} from 'mongoose';

const assignmentSchmea = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    subject: {
        type: String,
        required: true
    },
    semester:{
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    assignment: {
        type: String,
        required: true
    },
    submissions: [
        {
            student:{
                type: Schema.Types.ObjectId,
                ref: 'Student',
            },
            file: {
                type: String,
                required: true
            }
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true,
    },
    
}, {timestamps: true});

export const Assignment = mongoose.model('Assignment', assignmentSchmea);