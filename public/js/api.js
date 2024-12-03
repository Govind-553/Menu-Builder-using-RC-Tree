const API_URL = '/api/menu';

export async function fetchMenuItems() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch menu items');
  return response.json();
}

export async function createMenuItem(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create menu item');
  return response.json();
}

export async function updateMenuItem(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update menu item');
  return response.json();
}

export async function deleteMenuItem(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete menu item');
  return response.json();
}