import mongoose from "mongoose";

const treatmentRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    visitDate: { type: String, required: true },
    doctor: { type: String, required: true, trim: true },
    diagnosis: { type: String, required: true, trim: true },
    treatment: { type: String, required: true, trim: true },
    medicines: { type: String, trim: true },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("TreatmentRecord", treatmentRecordSchema);
