// counter.schema.ts
import { Schema } from 'mongoose';


export const CounterSchema = new Schema({
  id: { type: String, required: true, unique: true }, // e.g., 'user'
  seq: { type: Number, default: 1 },
});
