import express from "express";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find({ createdBy: req.user.id })
      .populate({ path: "patient", select: "name", match: { createdBy: req.user.id } })
      .sort({ appointmentDate: 1 });

    res.json(appointments.filter((appointment) => appointment.patient));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/patient/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.patientId,
      createdBy: req.user.id
    });

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const appointment = await Appointment.create({
      patient: patient._id,
      createdBy: req.user.id,
      appointmentDate: req.body.appointmentDate,
      doctor: req.body.doctor,
      reason: req.body.reason,
      notes: req.body.notes
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
