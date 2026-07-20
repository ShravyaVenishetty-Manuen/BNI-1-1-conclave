import { auth } from '../config/firebase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function getAuthHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };

  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    const savedToken = localStorage.getItem('bni_auth_token');
    if (savedToken) {
      headers['Authorization'] = `Bearer ${savedToken}`;
    }
  }

  return headers;
}

export const api = {
  async get(endpoint) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || err.message || `Request to ${endpoint} failed`);
    }
    return response.json();
  },

  async post(endpoint, body) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || err.message || `Request to ${endpoint} failed`);
    }
    return response.json();
  },

  async patch(endpoint, body) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || err.message || `Request to ${endpoint} failed`);
    }
    return response.json();
  },

  async delete(endpoint) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || err.message || `Request to ${endpoint} failed`);
    }
    return response.json();
  }
};
