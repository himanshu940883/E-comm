const API_BASE = 'http://localhost:5000/api';

// ===================== Local Storage =====================
export function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function logoutUser() {
  localStorage.removeItem('user');
}

// ===================== Register =====================
export async function registerUser(user_id, password, role = 'user') {
  try {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, password, role })
    });

    const data = await res.json();
    if (res.ok && data.user_id) { return true; }
    else {
      console.warn('Register failed:', data.error || 'Unknown error');
      return false;
    }
  } catch (err) {
    console.error('Registration error:', err.message);
    return false;
  }
}

// ===================== Login =====================
export async function loginUser(user_id, password) {
  try {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, password })
    });

    const data = await res.json();
    if (res.ok && data.user_id) {
      setUser({ user_id: data.user_id, role: data.role || 'user' });
      return true;
    } else {
      console.warn('Login failed:', data.error || 'Unknown error');
      return false;
    }
  } catch (err) {
    console.error('Login error:', err.message);
    return false;
  }
}
