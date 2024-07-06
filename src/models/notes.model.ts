import mongoose, { Schema, Document } from 'mongoose';

interface NotesDoc extends Document {
  note: string;
}

const NoteSchema = new Schema(
  {
    note: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'employee' },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        delete ret._id;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Notes = mongoose.model<NotesDoc>('notes', NoteSchema);

export { Notes };
