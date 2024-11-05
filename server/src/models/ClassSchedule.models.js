import mongoose from 'mongoose'

const classScheduleSchema = new mongoose.Schema({ 
  semester: {
    type: String,
    required: true,
  },
  stream: {
    type: String,
    required: true,
  },
  weeklySchedule: [
    {
      day: {
        type: String,
        required: true,
      },
      classes: [
        {
          subject: {
            type: String,
            required: true,
          },
          instructor: {
            type: String,
            required: true,
          },
          startTime: {
            type: String,
            required: true,
          },
          endTime: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

const ClassSchedule = mongoose.model('ClassSchedule', classScheduleSchema);

export default ClassSchedule
