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
      if (user.email) {
        headers['X-User-Id'] = user.email;
        headers['X-User-Email'] = user.email;
      }
    } catch (e) {
      console.warn("Could not refresh user token:", e);
    }
  } else {
    const savedToken = localStorage.getItem('bni_auth_token');
    if (savedToken) {
      headers['Authorization'] = `Bearer ${savedToken}`;
    }
  }

  const role = localStorage.getItem('bni_user_role') || 'member';
  let activeSession = null;
  if (role === 'member') {
    activeSession = localStorage.getItem('bni_logged_member');
  } else if (role === 'captain') {
    activeSession = localStorage.getItem('bni_logged_captain');
  } else {
    activeSession = localStorage.getItem('bni_logged_admin');
  }

  if (activeSession) {
    try {
      const parsed = JSON.parse(activeSession);
      if (parsed.uid || parsed.id || parsed.email) {
        headers['X-User-Id'] = parsed.uid || parsed.id || parsed.email;
      }
      if (parsed.email && !headers['X-User-Email']) {
        headers['X-User-Email'] = parsed.email;
      }
    } catch {}
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

  async put(endpoint, body) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
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
