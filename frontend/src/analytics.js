import { getCurrentUser } from './auth.js';

/**
 * Logs user interactions for analysis.
 * @param {string} eventName 
 * @param {object} payload
 */
export function trackEvent(eventName, payload = {}) {
  const timestamp = new Date().toISOString();
  const user = getCurrentUser();

  const log = {
    event: eventName,
    user: user?.user_id || 'guest',
    role: user?.role || 'unknown',
    time: timestamp,
    ...payload
  };

  console.log('%c[Analytics Event]', 'color: #0288d1; font-weight: bold;', log);

  // fetch('http://localhost:5000/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(log)
  // }).catch(err => console.error('Analytics error:', err));
}
