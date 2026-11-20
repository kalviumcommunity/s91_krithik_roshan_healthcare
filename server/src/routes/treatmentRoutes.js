import express from "express";
import TreatmentRecord from "../models/TreatmentRecord.js";
import Patient from "../models/Patient.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

// GET treatment history for a patient
router.get("/patient/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.patientId,
      createdBy: req.user.id
    });

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const records = await TreatmentRecord.find({ patient: patient._id }).sort({
      visitDate: -1
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST treatment record
router.post("/patient/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.patientId,
      createdBy: req.user.id
    });

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const record = await TreatmentRecord.create({
      ...req.body,
      patient: patient._id
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT treatment record
router.put("/:id", async (req, res) => {
  try {
    const record = await TreatmentRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Treatment record not found" });

    const patient = await Patient.findOne({
      _id: record.patient,
      createdBy: req.user.id
    });
    if (!patient) return res.status(403).json({ message: "Not authorized" });

    const updated = await TreatmentRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE treatment record
router.delete("/:id", async (req, res) => {
  try {
    const record = await TreatmentRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Treatment record not found" });

    const patient = await Patient.findOne({
      _id: record.patient,
      createdBy: req.user.id
    });
    if (!patient) return res.status(403).json({ message: "Not authorized" });

    await TreatmentRecord.findByIdAndDelete(req.params.id);
    res.json({ message: "Treatment record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
