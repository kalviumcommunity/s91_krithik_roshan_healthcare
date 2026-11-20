import React, { useEffect, useState } from "react";
import { api } from "./api.js";

const emptyPatient = {
  name: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  gender: "",
  address: ""
};

const emptyTreatment = {
  visitDate: "",
  doctor: "",
  diagnosis: "",
  treatment: "",
  medicines: "",
  notes: ""
};

const emptyAppointment = {
  appointmentDate: "",
  doctor: "",
  reason: "",
  notes: ""
};

function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("token")));
  const [screen, setScreen] = useState("dashboard");
  const [patientId, setPatientId] = useState(null);
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    const handleInvalidToken = () => {
      setLoggedIn(false);
      setScreen("dashboard");
      setPatientId(null);
      setAuthMessage("Your session is invalid or expired. Please log in again.");
    };

    window.addEventListener("auth:invalid", handleInvalidToken);
    return () => window.removeEventListener("auth:invalid", handleInvalidToken);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLoggedIn(false);
    setScreen("dashboard");
    setAuthMessage("");
  };

  if (!loggedIn) {
    return <Auth onLogin={() => setLoggedIn(true)} initialMessage={authMessage} />;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Clinic Patient History</h1>
          <p>Patient information and treatment history</p>
        </div>
        <div className="top-actions">
          <span>Signed in as {localStorage.getItem("username")}</span>
          <button className="secondary" onClick={logout}>Logout</button>
        </div>
      </header>

      <nav className="nav">
        <button onClick={() => { setScreen("dashboard"); setPatientId(null); }}>
          Patients
        </button>
        <button onClick={() => setScreen("add-patient")}>Add Patient</button>
        <button onClick={() => setScreen("appointments")}>Appointments</button>
      </nav>

      <main className="content">
        {screen === "dashboard" && (
          <Dashboard onOpen={(id) => { setPatientId(id); setScreen("patient"); }} />
        )}
        {screen === "add-patient" && (
          <PatientForm
            title="Add Patient"
            onSaved={(id) => { setPatientId(id); setScreen("patient"); }}
          />
        )}
        {screen === "appointments" && (
          <Appointments
            onOpenPatient={(id) => { setPatientId(id); setScreen("patient"); }}
          />
        )}
        {screen === "patient" && patientId && (
          <PatientDetails patientId={patientId} />
        )}
      </main>
    </div>
  );
}

function Appointments({ onOpenPatient }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setAppointments(await api.getAppointments());
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await api.deleteAppointment(id);
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section>
      <div className="section-heading">
        <div>
          <h2>Appointments</h2>
          <p className="muted">Scheduled patient visits, ordered by date.</p>
        </div>
      </div>
      {message && <div className="message error">{message}</div>}
      {loading ? (
        <div className="card empty">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="card empty">
          <h3>No appointments scheduled</h3>
          <p>Open a patient record to schedule an appointment.</p>
        </div>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr><th>Date and time</th><th>Patient</th><th>Doctor</th><th>Reason</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                  <td>{appointment.patient.name}</td>
                  <td>{appointment.doctor}</td>
                  <td>{appointment.reason}</td>
                  <td className="row-actions">
                    <button onClick={() => onOpenPatient(appointment.patient._id)}>Patient record</button>
                    <button className="danger" onClick={() => cancel(appointment._id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Auth({ onLogin, initialMessage }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(initialMessage);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (mode === "register") {
        await api.register(form);
        setMode("login");
        setMessage("Account created. Please log in.");
      } else {
        const data = await api.login(form);
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        onLogin();
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <h1>Clinic Patient History</h1>
        <p className="muted">
          {mode === "login" ? "Sign in to access patient records." : "Create a clinic account."}
        </p>

        <label>Username</label>
        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {message && <div className="message">{message}</div>}

        <button className="primary" type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>

        <button
          type="button"
          className="link-button"
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ onOpen }) {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setPatients(await api.getPatients());
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this patient and their treatment history?")) return;
    try {
      await api.deletePatient(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
      <div className="section-heading">
        <div>
          <h2>Patients</h2>
          <p className="muted">Find a patient and open the complete treatment history.</p>
        </div>
        <input
          className="search"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="message error">{error}</div>}
      {loading ? (
        <div className="card empty">Loading patient records...</div>
      ) : filtered.length === 0 ? (
        <div className="card empty">
          <h3>No patients found</h3>
          <p>No patient records match the current search.</p>
        </div>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient) => (
                <tr key={patient._id}>
                  <td>{patient.name}</td>
                  <td>{patient.dateOfBirth}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.gender || "-"}</td>
                  <td className="row-actions">
                    <button onClick={() => onOpen(patient._id)}>View History</button>
                    <button className="danger" onClick={() => remove(patient._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function PatientForm({ title, existing, onSaved }) {
  const [form, setForm] = useState(existing || emptyPatient);
  const [message, setMessage] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage("This browser does not support location access.");
      return;
    }

    setGettingLocation(true);
    setMessage("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`
          );

          if (!response.ok) {
            throw new Error("Address lookup is unavailable. Please enter the address manually.");
          }

          const location = await response.json();
          if (!location.display_name) {
            throw new Error("No readable address was found. Please enter the address manually.");
          }

          setForm((current) => ({ ...current, address: location.display_name }));
        } catch (error) {
          setMessage(error.message || "Unable to look up your address. Please enter it manually.");
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        const errors = {
          1: "Location permission was denied. Allow location access and try again.",
          2: "Your location is currently unavailable. Please try again.",
          3: "Location request timed out. Please try again."
        };
        setMessage(errors[error.code] || "Unable to get your current location.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = existing
        ? await api.updatePatient(existing._id, form)
        : await api.createPatient(form);
      onSaved(data._id);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form className="card form-card" onSubmit={submit}>
      <h2>{title}</h2>
      <div className="form-grid">
        <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Field label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(v) => setForm({ ...form, dateOfBirth: v })} required />
        <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Field
          label="Gender"
          value={form.gender}
          onChange={(v) => setForm({ ...form, gender: v })}
          options={["Male", "Female"]}
        />
        <label>
          Address
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <button
            type="button"
            className="secondary"
            onClick={useCurrentLocation}
            disabled={gettingLocation}
          >
            {gettingLocation ? "Getting location..." : "Use current location"}
          </button>
          <small className="muted">Address lookup provided by OpenStreetMap.</small>
        </label>
      </div>
      {message && <div className="message error">{message}</div>}
      <button className="primary" type="submit">Save Patient</button>
    </form>
  );
}

function PatientDetails({ patientId }) {
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [treatmentForm, setTreatmentForm] = useState(emptyTreatment);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [message, setMessage] = useState("");
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointment);
  const [appointmentMessage, setAppointmentMessage] = useState("");

  const load = async () => {
    try {
      setData(await api.getPatient(patientId));
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => { load(); }, [patientId]);

  if (!data) return <div className="card">Loading patient history...</div>;

  const submitTreatment = async (e) => {
    e.preventDefault();
    try {
      if (editingTreatment) {
        await api.updateTreatment(editingTreatment._id, treatmentForm);
      } else {
        await api.createTreatment(patientId, treatmentForm);
      }
      setTreatmentForm(emptyTreatment);
      setEditingTreatment(null);
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const editTreatment = (record) => {
    setEditingTreatment(record);
    setTreatmentForm({
      visitDate: record.visitDate,
      doctor: record.doctor,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      medicines: record.medicines || "",
      notes: record.notes || ""
    });
  };

  const deleteTreatment = async (id) => {
    if (!window.confirm("Delete this treatment record?")) return;
    try {
      await api.deleteTreatment(id);
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const submitAppointment = async (e) => {
    e.preventDefault();
    try {
      await api.createAppointment(patientId, appointmentForm);
      setAppointmentForm(emptyAppointment);
      setAppointmentMessage("Appointment scheduled successfully.");
    } catch (error) {
      setAppointmentMessage(error.message);
    }
  };

  return (
    <section>
      <div className="card patient-header">
        <div>
          <h2>{data.patient.name}</h2>
          <p>{data.patient.phone} · {data.patient.email || "No email"}</p>
          <p>DOB: {data.patient.dateOfBirth} · {data.patient.gender || "Gender not specified"}</p>
          <p>{data.patient.address || "No address recorded"}</p>
        </div>
        <button onClick={() => setEditing(!editing)}>
          {editing ? "Close Edit" : "Edit Patient"}
        </button>
      </div>

      {editing && (
        <PatientForm
          title="Edit Patient"
          existing={data.patient}
          onSaved={async () => { setEditing(false); await load(); }}
        />
      )}

      <form className="card form-card" onSubmit={submitAppointment}>
        <h3>Schedule an Appointment</h3>
        <p className="muted">Set a visit date and time for this patient.</p>
        <div className="form-grid">
          <Field label="Date and time" type="datetime-local" value={appointmentForm.appointmentDate} onChange={(v) => setAppointmentForm({ ...appointmentForm, appointmentDate: v })} required />
          <Field label="Doctor" value={appointmentForm.doctor} onChange={(v) => setAppointmentForm({ ...appointmentForm, doctor: v })} required />
          <Field label="Reason for visit" value={appointmentForm.reason} onChange={(v) => setAppointmentForm({ ...appointmentForm, reason: v })} required />
          <Field label="Notes" value={appointmentForm.notes} onChange={(v) => setAppointmentForm({ ...appointmentForm, notes: v })} />
        </div>
        {appointmentMessage && (
          <div className={`message ${appointmentMessage === "Appointment scheduled successfully." ? "" : "error"}`}>
            {appointmentMessage}
          </div>
        )}
        <button className="primary" type="submit">Schedule Appointment</button>
      </form>

      <div className="section-heading">
        <div>
          <h2>Treatment History</h2>
          <p className="muted">Complete visit records linked to this patient.</p>
        </div>
      </div>

      {message && <div className="message error">{message}</div>}

      <form className="card form-card" onSubmit={submitTreatment}>
        <h3>{editingTreatment ? "Edit Treatment Record" : "Add Treatment Record"}</h3>
        <div className="form-grid">
          <Field label="Visit Date" type="date" value={treatmentForm.visitDate} onChange={(v) => setTreatmentForm({ ...treatmentForm, visitDate: v })} required />
          <Field label="Doctor" value={treatmentForm.doctor} onChange={(v) => setTreatmentForm({ ...treatmentForm, doctor: v })} required />
          <Field label="Diagnosis" value={treatmentForm.diagnosis} onChange={(v) => setTreatmentForm({ ...treatmentForm, diagnosis: v })} required />
          <Field label="Treatment" value={treatmentForm.treatment} onChange={(v) => setTreatmentForm({ ...treatmentForm, treatment: v })} required />
          <Field label="Medicines" value={treatmentForm.medicines} onChange={(v) => setTreatmentForm({ ...treatmentForm, medicines: v })} />
          <Field label="Notes" value={treatmentForm.notes} onChange={(v) => setTreatmentForm({ ...treatmentForm, notes: v })} />
        </div>
        <button className="primary" type="submit">
          {editingTreatment ? "Update Record" : "Add Record"}
        </button>
        {editingTreatment && (
          <button
            type="button"
            className="secondary cancel-button"
            onClick={() => { setEditingTreatment(null); setTreatmentForm(emptyTreatment); }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {data.treatments.length === 0 ? (
        <div className="card empty">
          <h3>No treatment history</h3>
          <p>No treatment records have been added for this patient.</p>
        </div>
      ) : (
        <div className="history-list">
          {data.treatments.map((record) => (
            <article className="card history-item" key={record._id}>
              <div className="history-top">
                <div>
                  <strong>{record.visitDate}</strong>
                  <span> · {record.doctor}</span>
                </div>
                <div className="row-actions">
                  <button onClick={() => editTreatment(record)}>Edit</button>
                  <button className="danger" onClick={() => deleteTreatment(record._id)}>Delete</button>
                </div>
              </div>
              <p><b>Diagnosis:</b> {record.diagnosis}</p>
              <p><b>Treatment:</b> {record.treatment}</p>
              <p><b>Medicines:</b> {record.medicines || "-"}</p>
              <p><b>Notes:</b> {record.notes || "-"}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Field({ label, type = "text", value, onChange, required, options }) {
  return (
    <label>
      {label}
      {options ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} required={required}>
          <option value="">Select gender</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}
    </label>
  );
}

export default App;
