export function renderAuthContainer() {
  const container = document.getElementById('auth-shell');
  if (!container) {
    return;
  }
  container.innerHTML = `
    <div class="auth-card">
      <div class="brand-row">
        <div class="logo">L</div>
        <div>
          <h1>LinkChat</h1>
        </div>
      </div>
      <div class="auth-tabs">
        <button class="auth-tab active" data-form="login">Login</button>
        <button class="auth-tab" data-form="register">Register</button>
      </div>
      <form id="login-form" class="auth-form active">
        <label>
          Username
          <input name="username" placeholder="@alex" required />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="••••••••" required />
        </label>
        <button type="submit">Sign in</button>
      </form>
      <form id="register-form" class="auth-form">
        <label>
          Display name
          <input name="displayName" placeholder="Alex Jordan" required />
        </label>
        <label>
          Username
          <input name="username" placeholder="alex" required />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Minimum 8 characters" required />
        </label>
        <button type="submit">Create account</button>
      </form>
    </div>
  `;
}

export function renderAppShell() {
  document.body.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <header class="sidebar-header">
          <div class="brand">
            <div class="logo mini">L</div>
            <h2>LinkChat</h2>
          </div>
          <button aria-label="New chat" class="ghost-button" id="newChatButton">+ New</button>
        </header>
        <div class="search-box">
          <input id="conversationSearch" placeholder="Search conversations" aria-label="Search conversations" />
        </div>
        <div id="conversationList" class="conversation-list"></div>
      </aside>
      <main class="chat-panel">
        <header class="chat-header">
          <div class="chat-header-user">
            <div class="avatar large" id="stateAvatar">A</div>
            <div>
              <h3 id="chatTitle">Select a chat</h3>
              <small id="chatStatus">Online</small>
            </div>
          </div>
          <div class="chat-actions">
            <button class="icon-button" aria-label="Call">📞</button>
            <button class="icon-button" aria-label="Video call">📹</button>
            <button class="icon-button" aria-label="Settings" id="settingsButton">⚙️</button>
          </div>
        </header>
        <div id="messageList" class="message-list" aria-live="polite"></div>
        <form id="messageForm" class="composer">
          <button type="button" class="composer-button" id="emojiButton" aria-label="Add emoji">😊</button>
          <textarea id="messageInput" aria-label="Type a message" rows="1" placeholder="Write a message..."></textarea>
          <button type="button" class="composer-button" aria-label="Voice note">🎙️</button>
          <button type="submit" class="send-button">Send</button>
        </form>
      </main>
    </div>
  `;
}
