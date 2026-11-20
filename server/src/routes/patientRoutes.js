import express from "express";
import Patient from "../models/Patient.js";
import TreatmentRecord from "../models/TreatmentRecord.js";
import Appointment from "../models/Appointment.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

// GET all patients for the logged-in user
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one patient and their treatment history
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const treatments = await TreatmentRecord.find({ patient: patient._id }).sort({
      visitDate: -1
    });

    res.json({ patient, treatments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST patient
router.post("/", async (req, res) => {
  try {
    const patient = await Patient.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT patient
router.put("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE patient and related treatment records
router.delete("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    await TreatmentRecord.deleteMany({ patient: patient._id });
    await Appointment.deleteMany({ patient: patient._id });
    res.json({ message: "Patient and treatment history deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
