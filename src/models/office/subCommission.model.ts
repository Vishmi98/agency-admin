import { Schema, model, Document, models } from "mongoose";


interface SubCommission extends Document {
  id: number;
  commissionId: number;
  month: string;
  staffId: number;
  amount: number;
  paidDateAndTime: Date | null;
  status: "available" | "paid";
  isAutoCreated: boolean;
  createDate: Date;
  updatedDate: Date;
}

const subCommissionSchema = new Schema<SubCommission>(
  {
    id: { type: Number, required: true, unique: true },
    commissionId: { type: Number, required: true },
    month: { type: String, required: true },
    staffId: { type: Number, required: true },
    amount: { type: Number, required: true },
    paidDateAndTime: { type: Date, default: null },
    status: {
      type: String,
      enum: ["available", "paid"],
      required: true,
      default: "available",
    },
    isAutoCreated: { type: Boolean, default: true },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
  }
);

subCommissionSchema.virtual("mainCommissionInfo", {
  ref: "MainCommission",
  localField: "commissionId",
  foreignField: "id",
  justOne: true,
});

subCommissionSchema.virtual("staffInfo", {
  ref: "Staff",
  localField: "staffId",
  foreignField: "id",
  justOne: true,
});

subCommissionSchema.set("toObject", { virtuals: true });
subCommissionSchema.set("toJSON", { virtuals: true });

const SubCommissionModel = models.SubCommission || model<SubCommission>("SubCommission", subCommissionSchema);

export default SubCommissionModel;
