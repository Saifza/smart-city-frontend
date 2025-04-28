const API_BASE = 'http://localhost:8083/energy';

export async function getAllEnergyUsage() {
  const res = await fetch(`${API_BASE}/usage`);
  return res.json();
}

export async function addEnergyUsage(data) {
  const res = await fetch(`${API_BASE}/usage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateEnergyUsage(id, data) {
  const res = await fetch(`${API_BASE}/usage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteEnergyUsage(id) {
  await fetch(`${API_BASE}/usage/${id}`, { method: 'DELETE' });
}
