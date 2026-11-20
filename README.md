# Healthcare Clinic Patient History System

## Problem Statement
Small healthcare clinics often keep patient information in paper files or disconnected systems. Finding a patient's complete treatment history can delay care and lead to duplicate tests or inconsistent records.

## Proposed Solution
A full-stack clinic application that gives authenticated clinic users one place to manage patient profiles, appointments, and treatment histories.

## Technology Stack
- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB with Mongoose; an in-memory MongoDB is started for local development when `MONGO_URI` is not set
- Authentication: username/password with JWT
- Frontend hosting configuration: Netlify (`netlify.toml`)

## Key Features
- Register and log in with JWT-based authentication.
- Search and manage patient profiles.
- Add, update, and delete treatment records linked to patients.
- Schedule and cancel patient appointments.
- Access protected API routes using a bearer token.

## Deployment and Walkthrough
- Frontend: Not provided.
- Backend: Not provided.
- Walkthrough video: Not provided.

Add verified public frontend and backend URLs and a walkthrough link here before submission. Deployment instructions are in [Deploy the frontend to Netlify](#deploy-the-frontend-to-netlify).

## Repository
[kalviumcommunity/s91_krithik_roshan_healthcare](https://github.com/kalviumcommunity/s91_krithik_roshan_healthcare)

## Scope — aligned to the provided Kalvium LUs
This project implements only the capabilities explicitly required by the provided LUs:

- GitHub repository/README/project workflow documentation
- React application initialized with Vite in `client`
- React frontend components
- Mongoose database schemas
- Database read/write through API calls
- GET APIs
- POST APIs
- PUT APIs
- Update and delete functionality
- Entity relationships in MongoDB
- Username/password authentication
- JWT-based authorization

Third-party authentication is intentionally not implemented because the provided material only shows the LU title and does not provide its implementation requirements.

## Main User Flow
Login/Register → Dashboard → Search/View Patients → Open Patient → Schedule Appointment or View Treatment History → Add Treatment Record → Edit/Delete Patient or Treatment Record.

## Application Screens
1. Login
2. Register
3. Dashboard / Patient List
4. Add Patient
5. Patient Details + Treatment History
6. Edit Patient
7. Appointments

## Data Model
- User
- Patient
- TreatmentRecord
- Appointment

Relationship:
`User` manages `Patient` records.
`Patient` has many `TreatmentRecord` records.
`Patient` has many `Appointment` records.
Each `TreatmentRecord` references one `Patient`.
Each `Appointment` references one `Patient` and the clinic account that scheduled it.

## API
Authentication:
- `POST /api/auth/register`
- `POST /api/auth/login`

Patients:
- `GET /api/patients`
- `GET /api/patients/:id`
- `POST /api/patients`
- `PUT /api/patients/:id`
- `DELETE /api/patients/:id`

Treatment records:
- `GET /api/treatments/patient/:patientId`
- `POST /api/treatments/patient/:patientId`
- `PUT /api/treatments/:id`
- `DELETE /api/treatments/:id`

Appointments:
- `GET /api/appointments`
- `POST /api/appointments/patient/:patientId`
- `DELETE /api/appointments/:id`

All protected application APIs require a valid JWT.

## Setup

### Prerequisites
- Node.js and npm
- MongoDB, if using a persistent local database

### Install dependencies
```bash
git clone https://github.com/kalviumcommunity/s91_krithik_roshan_healthcare.git
cd s91_krithik_roshan_healthcare
npm --prefix server install
npm --prefix client install
```

### Configure the server
Create `server/src/.env` (or copy `server/.env.example`) and set:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/healthcare_clinic
JWT_SECRET=replace_with_a_long_random_secret
```

If `MONGO_URI` is omitted, the server starts a temporary in-memory MongoDB; data will not persist after it stops.

### Run the application
```bash
npm run dev
```

This starts the API at `http://localhost:5000` and the Vite frontend at `http://localhost:5173`. Check the API at `http://localhost:5000/api/health`.

## Deploy the frontend to Netlify

The root `netlify.toml` configures Netlify to build the `client` app with
`npm run build`, publish `client/dist`, and serve the app entry point for
unknown routes.

1. Push this project to a Git provider and import the repository in Netlify.
2. Set the Netlify environment variable `VITE_API_URL` to the public backend
   URL, including `/api` (for example, `https://your-backend.example.com/api`).
   The frontend defaults to `http://localhost:5000/api` for local development.
3. Trigger a deploy. Netlify builds the frontend; the Express API and its
   MongoDB database must be hosted separately for login and patient records to
   work in production.

## Important
This is an educational capstone implementation based only on the supplied LUs. Do not use real patient/medical information in development.
