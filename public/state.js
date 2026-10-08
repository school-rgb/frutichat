export const state = {
  user: null,
  conversations: [],
  activeConversationId: null,
  messages: {},
  typing: {},
  presence: {},
  connection: {
    status: 'disconnected',
    retryDelay: 1000,
    reconnecting: false
  }
};

export function setUser(user) {
  state.user = user;
}

export function getConversationById(id) {
  return state.conversations.find((conversation) => conversation.id === id) || null;
}

export function setConversationList(list) {
  state.conversations = list;
}

export function addMessage(conversationId, message) {
  if (!state.messages[conversationId]) {
    state.messages[conversationId] = [];
  }

  if (!state.messages[conversationId].some((entry) => entry.id === message.id)) {
    state.messages[conversationId].push(message);
  }
}

export function setMessages(conversationId, list) {
  state.messages[conversationId] = list;
}

export function setActiveConversationId(id) {
  state.activeConversationId = id;
}

export function setTyping(userId, value) {
  state.typing[userId] = value;
}

export function updatePresence(userId, update) {
  state.presence[userId] = { ...state.presence[userId], ...update };
}
