import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IApplication extends Document {
  applicationNumber?: string;
  userId: Types.ObjectId;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    applicationNumber: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantPhone: { type: String, required: true },
    status: {
      type: String,
      default: 'draft',
    },
  },
  { timestamps: true }
);

const Application = mongoose.model<IApplication>(
  'Application',
  ApplicationSchema
);

export default Application;
