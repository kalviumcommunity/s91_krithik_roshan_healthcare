import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    appointmentDate: { type: Date, required: true },
    doctor: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
