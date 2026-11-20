import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import treatmentRoutes from "./routes/treatmentRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config({ path: new URL("./.env", import.meta.url) });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Healthcare Clinic API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      const mongoMemoryServer = await MongoMemoryServer.create();
      mongoUri = mongoMemoryServer.getUri();
      console.log("Using in-memory MongoDB for local development");
    }

    await mongoose.connect(mongoUri);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`MongoDB connected: ${mongoUri}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
