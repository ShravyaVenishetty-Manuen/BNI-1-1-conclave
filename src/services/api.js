import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Returns a promise that resolves to the current Firebase user (or null)
 * AFTER Firebase has finished restoring the session from its cache.
 *
 * Why: auth.currentUser is null synchronously on first load — Firebase
 * restores the session asynchronously. Reading it before the restore
 * finishes causes all API calls to go out without a Bearer token, which
 * makes the backend treat every request as "insecure-dev-admin" and
 * return empty schedule data.
 */
function getAuthenticatedUser() {
  return new Promise((resolve) => {
    // onAuthStateChanged fires immediately if already resolved, or waits
    // for Firebase to finish restoring the session. We only need it once.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // unsubscribe immediately — we only need the first event
      resolve(user);
    });
  });
}

async function getAuthHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };

  const user = await getAuthenticatedUser();
  if (user) {
    try {
      const token = await user.getIdToken(/* forceRefresh */ true);
      headers['Authorization'] = `Bearer ${token}`;
    } catch (e) {
      console.warn("Could not refresh user token:", e);
    }
  } else {
    // Fallback for cases where Firebase session is not available
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
