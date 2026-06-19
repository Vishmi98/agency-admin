import { Schema, model, Document, models } from "mongoose";

interface Role extends Document {
    roll: number;
    title: string;
    basicSalary: number;
    createdBy: number;
    createDate: Date;
    updatedDate: Date;
}

const RoleSchema = new Schema<Role>({
    roll: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    basicSalary: { type: Number, required: true },
    createdBy: { type: Number },
    createDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
});


const RoleModel = models.Role || model<Role>("Role", RoleSchema);

export default RoleModel;
