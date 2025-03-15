const baseUrl = 'http://127.0.0.1:5000'; // Adjust if needed

export async function registerHospital(token: string, name: string, lat: string, long: string) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('latitude', lat);
  formData.append('longitude', long);
  const res = await fetch(`${baseUrl}/register_hospital`, {
    method: 'POST',
    headers: { 'x-access-token': token },
    body: formData,
  });
  return res.text();
}

export async function getHospitals(token: string) {
  const res = await fetch(`${baseUrl}/get_hospitals`, {
    headers: { 'x-access-token': token },
  });
  return res.json();
}

// ...similar exports for addHealthRec, getHealthRec, addResource, getResource, getResources,
// filterResources, updateHealthRec, deleteHealthRec, bookAppointment, reschedule, cancelAppointment...

export async function signUp(email: string, password: string, name: string) {
  const res = await fetch(`${baseUrl}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  return res.json();
}

export async function signIn(email: string, password: string) {
  const res = await fetch(`${baseUrl}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
