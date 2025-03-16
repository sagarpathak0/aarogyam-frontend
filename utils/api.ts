// Make baseUrl exportable
export const baseUrl = 'https://3500-2401-4900-8847-90de-912-8fd4-1b1a-8f42.ngrok-free.app'; // Adjust if needed

// Helper function to safely parse API responses
async function safeJsonParse(response: Response) {
  const text = await response.text();
  
  // Check if the response starts with HTML tags (error page)
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    console.error('Received HTML instead of JSON from API');
    return { error: true, message: 'Server returned an error page', htmlResponse: true };
  }
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse response as JSON:', text.substring(0, 150) + '...');
    return { error: true, message: 'Invalid JSON response from server', rawResponse: text };
  }
}

export async function registerHospital(token: string, name: string, email: string, password: string) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  
  const res = await fetch(`${baseUrl}/register_hospital`, {
    method: 'POST',
    headers: { 'x-access-token': token },
    body: formData,
  });
  
  // First get text response
  const text = await res.text();
  
  // Try to parse as JSON, if it fails, return as message object
  try {
    return JSON.parse(text);
  } catch (e) {
    // Return text as message in an object to maintain consistent return format
    return { message: text, success: res.ok };
  }
}

export async function getHospitals(token: string) {
  try {
    const res = await fetch(`${baseUrl}/get_hospitals`, {
      headers: { 'x-access-token': token },
    });
    
    // Check for HTTP errors before parsing JSON
    if (!res.ok) {
      return { error: true, message: `Server returned ${res.status}: ${res.statusText}` };
    }
    
    return await safeJsonParse(res);
  } catch (e) {
    console.error('Network or parsing error:', e);
    return { error: true, message: 'Failed to connect to the server', details: e };
  }
}

export async function addHealthRec(token: string, email: string, recordData: object) {
  const res = await fetch(`${baseUrl}/add_health_rec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({ email: email, record_data: recordData }),
  });
  return res.json();
}

export async function getHealthRec(token: string, email: string) {
  const res = await fetch(`${baseUrl}/get_health_rec/${email}`, {
    headers: { 'x-access-token': token },
  });
  return res.json();
}

export async function updateHealthRec(token: string, email: string, recordId: string, recordData: object) {
  const res = await fetch(`${baseUrl}/update_health_rec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token },
    body: JSON.stringify({
      email: email,
      record_id: recordId,
      record_data: recordData,
    }),
  });
  return res.json();
}

export async function deleteHealthRec(token: string, email: string, recordId: string) {
  const res = await fetch(`${baseUrl}/delete_health_rec?email=${email}&record_id=${recordId}`, {
    method: 'DELETE',
    headers: { 'x-access-token': token },
  });
  return res.json();
}

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

export async function signInAdmin(email: string, password: string) {
  const res = await fetch(`${baseUrl}/signin_admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// Appointment functions
export async function bookAppointment(token: string, providerId: string, date: string, time: string) {
  const res = await fetch(`${baseUrl}/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({
      provider_id: 'c25443',
      date,
      time
    }),
  });
  return res.json();
}

export async function rescheduleAppointment(token: string, appointmentId: string, newDate: string, newTime: string) {
  const res = await fetch(`${baseUrl}/reschedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token },
    body: JSON.stringify({
      appointment_id: appointmentId,
      new_date: newDate,
      new_time: newTime
    }),
  });
  return res.json();
}

export async function cancelAppointment(token: string, appointmentId: string) {
  const res = await fetch(`${baseUrl}/cancel_appointment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token },
    body: JSON.stringify({ appointment_id: appointmentId }),
  });
  return res.json();
}

export async function getUserAppointments(token: string) {
  const res = await fetch(`${baseUrl}/appointments`, {
    headers: { 'x-access-token': token },
  });
  return res.json();
}

export async function getAllAppointments(token: string) {
  try {
    const res = await fetch(`${baseUrl}/all_appointments`, {
      headers: { 'x-access-token': token },
    });
    
    // Check for HTTP errors before parsing JSON
    if (!res.ok) {
      return { error: true, message: `Server returned ${res.status}: ${res.statusText}` };
    }
    
    const data = await safeJsonParse(res);
    
    // If valid data and it's an array, return it, otherwise return empty array
    if (!data.error && Array.isArray(data)) {
      return data;
    }
    
    console.error('Invalid appointment data received:', data);
    return [];
  } catch (e) {
    console.error('Failed to fetch appointments:', e);
    return [];
  }
}

export async function addpract(token: string, name: string, email: string, speciality: string) {
  const res = await fetch(`${baseUrl}/register_practitioner`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'x-access-token': token 
    },
    body: JSON.stringify({ name, email, speciality })
  });
  
  // Handle response the same way as other API functions
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return { message: text, success: res.ok };
  }
}

export async function fetchpract(token: string) {
  const res = await fetch(`${baseUrl}/all_practitioners`, {
    method: 'GET',
    headers: { 'x-access-token': token },
  });
  console.log(res);
  return res.json();
}