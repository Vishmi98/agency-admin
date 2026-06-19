import { Schema, model, Document, models } from "mongoose";

interface Commission extends Document {
  id: Number;
  role: Number;
  amount: Number;
  createDate: Date;
  updatedDate: Date;
}

const CommissionSchema = new Schema<Commission>({
  id: { type: Number, required: true, unique: true },
  role: { type: Number, required: true, unique: true },
  amount: { type: Number, required: true },
  createDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

const CommissionModel = models.Commission || model<Commission>("Commission", CommissionSchema);

export default CommissionModel;
