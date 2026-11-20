const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.dispatchEvent(new Event("auth:invalid"));
    }

    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  getPatients: () => request("/patients"),

  getPatient: (id) => request(`/patients/${id}`),

  createPatient: (body) =>
    request("/patients", { method: "POST", body: JSON.stringify(body) }),

  updatePatient: (id, body) =>
    request(`/patients/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  deletePatient: (id) =>
    request(`/patients/${id}`, { method: "DELETE" }),

  createTreatment: (patientId, body) =>
    request(`/treatments/patient/${patientId}`, {
      method: "POST",
      body: JSON.stringify(body)
    }),

  updateTreatment: (id, body) =>
    request(`/treatments/${id}`, {
      method: "PUT",
      body: JSON.stringify(body)
    }),

  deleteTreatment: (id) =>
    request(`/treatments/${id}`, { method: "DELETE" }),

  getAppointments: () => request("/appointments"),

  createAppointment: (patientId, body) =>
    request(`/appointments/patient/${patientId}`, {
      method: "POST",
      body: JSON.stringify(body)
    }),

  deleteAppointment: (id) =>
    request(`/appointments/${id}`, { method: "DELETE" })
};
