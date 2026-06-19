import mongoose, { Schema, Document, models } from 'mongoose';

interface IVerification extends Document {
  code: string;
  email: string;
  phoneNumber: string;
  type: string;
  createdAt: Date;
  expiresAt: Date;
  userType: number;
}

const verificationSchema: Schema = new Schema({
  userType: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
  type: {
    type: String,
    required: true,
  },
});

export const VerificationModel = models.Verification || mongoose.model<IVerification>('Verification', verificationSchema);
