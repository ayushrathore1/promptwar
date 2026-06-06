import mongoose, { Schema, Document } from 'mongoose';
import { EXAM_TYPES, ExamType } from '../types';

export interface StudentDocument extends Document {
  name: string;
  exam: ExamType;
  examDate: Date;
  city: string;
  streak: number;
  lastCheckIn: Date | null;
  background: string;
}

const studentSchema = new Schema<StudentDocument>(
  {
    name: { type: String, required: true },
    exam: { type: String, enum: EXAM_TYPES, required: true },
    examDate: { type: Date, required: true },
    city: { type: String, required: true },
    streak: { type: Number, default: 0 },
    lastCheckIn: { type: Date, default: null },
    background: { type: String, required: true },
  },
  { timestamps: true }
);

export const Student = mongoose.model<StudentDocument>('Student', studentSchema);
