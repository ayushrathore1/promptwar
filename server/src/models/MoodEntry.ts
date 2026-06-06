import mongoose, { Schema, Document } from 'mongoose';
import { MOOD_LABELS, TRIGGER_TYPES, MoodScore, MoodLabel, TriggerType } from '../types';

export interface MoodEntryDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  moodScore: MoodScore;
  moodLabel: MoodLabel;
  trigger: TriggerType;
  note?: string;
  createdAt: Date;
}

const moodEntrySchema = new Schema<MoodEntryDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    moodScore: { type: Number, min: 1, max: 5, required: true },
    moodLabel: { type: String, enum: MOOD_LABELS, required: true },
    trigger: { type: String, enum: TRIGGER_TYPES, required: true },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

// Index for efficient mood history queries (last 14 days per student)
moodEntrySchema.index({ studentId: 1, createdAt: -1 });

export const MoodEntry = mongoose.model<MoodEntryDocument>('MoodEntry', moodEntrySchema);
