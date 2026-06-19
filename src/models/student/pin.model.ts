import mongoose, { Schema } from "mongoose";

export interface IPin extends Document {
  email: string;
  pin: string;
  createTime: Date;
  expiresAt: Date;
  isUserLog: boolean;
}

const pinSchema = new Schema<IPin>({
  email: { type: String, required: true },
  pin: { type: String, required: true },
  createTime: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  isUserLog: { type: Boolean, default: false },
});

const PinModel = mongoose.models.Pin || mongoose.model("Pin", pinSchema);

export default PinModel;
