// =======================
// DOM Elements
// =======================
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const sendButton = form.querySelector("button[type='submit']");

let thinkingMessageElement = null;

// =======================
// Theme Handling
// =======================
function setTheme(isDarkMode) {
  if (isDarkMode) {
    body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-mode");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem("theme", "light");
  }
}

// Load saved theme on startup
setTheme(localStorage.getItem("theme") === "dark");

// Toggle theme on button click
themeToggle.addEventListener("click", () => {
  const isDarkMode = body.classList.contains("dark-mode");
  setTheme(!isDarkMode);
});

// =======================
// Button Visibility
// =======================
function toggleSendButtonVisibility() {
  const hasText = input.value.trim().length > 0;
  sendButton.classList.toggle("visible", hasText);
}

input.addEventListener("input", toggleSendButtonVisibility);

// =======================
// Chat Submission
// =======================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  input.value = "";
  toggleSendButtonVisibility();

  showThinkingIndicator();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    removeThinkingIndicator();

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    appendMessage("bot", data.reply);
  } catch (error) {
    removeThinkingIndicator();
    console.error("Error sending message to backend:", error);
    appendMessage("bot", `Sorry, I encountered an error: ${error.message}`);
  }
});

// =======================
// Utility Functions
// =======================
function appendMessage(sender, text) {
  const msgElement = document.createElement("div");
  msgElement.classList.add("message", sender);
  msgElement.innerHTML = marked.parse(text);
  chatBox.appendChild(msgElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showThinkingIndicator() {
  thinkingMessageElement = document.createElement("div");
  thinkingMessageElement.classList.add("message", "bot", "thinking-indicator");
  thinkingMessageElement.textContent = "Gemini is thinking...";
  chatBox.appendChild(thinkingMessageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeThinkingIndicator() {
  if (thinkingMessageElement && chatBox.contains(thinkingMessageElement)) {
    chatBox.removeChild(thinkingMessageElement);
    thinkingMessageElement = null;
  }
}
