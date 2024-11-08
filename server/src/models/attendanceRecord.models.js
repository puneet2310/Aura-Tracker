import mongoose, { Schema } from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  facultyId: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Excused'],
    required: true,
  },
  weekNumber: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

// Indexes for optimized querying
attendanceRecordSchema.index({ studentId: 1, subject: 1, month: 1, year: 1 });
attendanceRecordSchema.index({ facultyId: 1, subject: 1, month: 1, year: 1 });
attendanceRecordSchema.index({ studentId: 1, year: 1, month: 1 });

// Model creation
export const AttendanceRecord = mongoose.model('AttendanceRecord', attendanceRecordSchema);
