# LU Traceability

| LU | Requirement | Implementation |
|---|---|---|
| 1.4 Mock UX & User Flow Design | Wireframe, flow, screen purpose, design reasoning, states | `docs/MOCK_UX.md` |
| 2.1 GitHub Repository Setup | README, project documentation, branch/PR workflow | `README.md` |
| 2.2 React Application Initialization | Vite React app in `client` | `client/` |
| 2.3 React Component Development | React frontend components | `client/src/App.jsx` |
| 2.4 Database Schema Design | Mongoose models | `server/src/models/` |
| 2.5 Database Read & Write | API calls perform MongoDB reads/writes | `server/src/routes/` |
| 2.6 GET API | GET endpoints | `patientRoutes.js`, `treatmentRoutes.js` |
| 2.7 POST API | POST endpoints | `authRoutes.js`, `patientRoutes.js`, `treatmentRoutes.js` |
| 2.8 PUT API | PUT endpoints | `patientRoutes.js`, `treatmentRoutes.js` |
| 2.9 Update & Delete | React update/delete functionality | `client/src/App.jsx` + API |
| 2.10 Entity Relationship | Patient ↔ TreatmentRecord relationship | `TreatmentRecord.patient` |
| 2.11 Username & Password Authentication | Register/login with password hashing | `authRoutes.js`, `User.js` |
| 2.12 JWT-Based Authorization | JWT issued at login and checked on protected routes | `middleware/auth.js` |

No third-party authentication implementation is included because its detailed LU requirements were not present in the supplied material.
