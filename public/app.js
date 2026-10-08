import api from './api.js';

export async function handleLogin(username, password) {
  const data = await api.login({ username, password });
  localStorage.setItem('linkchat_token', data.token);
  return data.user;
}

export async function handleRegister(payload) {
  const data = await api.register(payload);
  localStorage.setItem('linkchat_token', data.token);
  return data.user;
}

export async function logoutCurrentUser() {
  try {
    await api.logout();
  } catch (_error) {
    // ignore
  }
  localStorage.removeItem('linkchat_token');
  location.reload();
}
