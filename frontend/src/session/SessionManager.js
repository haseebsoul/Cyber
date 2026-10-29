const SESSION_KEY = "cybersentinel_session";

export function saveSession(user) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
  catch (error) { console.error("Failed to save session:", error); }
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to read session:", error);
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("token"); // Remove the JWT on logout too.
  } catch (error) { console.error("Failed to clear session:", error); }
}
