import mongoose, { Schema, Document } from 'mongoose';
import { TRIGGER_TYPES, TriggerType } from '../types';

export interface MicroActionDocument extends Document {
  trigger: TriggerType;
  title: string;
  instruction: string;
  durationSeconds: number;
}

const microActionSchema = new Schema<MicroActionDocument>(
  {
    trigger: { type: String, enum: TRIGGER_TYPES, required: true, index: true },
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    durationSeconds: { type: Number, default: 30 },
  },
  { timestamps: true }
);

export const MicroAction = mongoose.model<MicroActionDocument>('MicroAction', microActionSchema);
