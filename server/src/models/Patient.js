import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    gender: { type: String, trim: true },
    address: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
