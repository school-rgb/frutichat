const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('linkchat_token');
}

async function requestJson(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data;
}

export const api = {
  async register(payload) {
    return requestJson('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },
  async login(payload) {
    return requestJson('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  },
  async logout() {
    return requestJson('/auth/logout', { method: 'POST' });
  },
  async getMe() {
    return requestJson('/me');
  },
  async patchMe(payload) {
    return requestJson('/me', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  async searchUsers(query) {
    return requestJson(`/users/search?q=${encodeURIComponent(query)}`);
  },
  async listConversations() {
    return requestJson('/conversations');
  },
  async createConversation(payload) {
    return requestJson('/conversations', { method: 'POST', body: JSON.stringify(payload) });
  },
  async getMessages(conversationId, before = '') {
    const params = before ? `?before=${encodeURIComponent(before)}` : '';
    return requestJson(`/conversations/${encodeURIComponent(conversationId)}/messages${params}`);
  },
  async sendMessage(conversationId, payload) {
    return requestJson(`/conversations/${encodeURIComponent(conversationId)}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async markRead(messageId) {
    return requestJson(`/messages/${encodeURIComponent(messageId)}/read`, { method: 'POST' });
  },
  async uploadFile(formData) {
    return fetch(`${API_BASE}/uploads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: formData
    }).then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      return data;
    });
  },
  async getCalls() {
    return requestJson('/calls');
  }
};

export default api;
