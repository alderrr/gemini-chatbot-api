const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const sendButton = document.querySelector("#chat-form button[type='submit']");

let thinkingMessageElement = null;

function toggleSendButtonVisibility() {
  if (input.value.trim().length > 0) {
    sendButton.classList.add("visible");
  } else {
    sendButton.classList.remove("visible");
  }
}
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

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  setTheme(true);
} else {
  setTheme(false);
}

themeToggle.addEventListener("click", () => {
  const isDarkMode = body.classList.contains("dark-mode");
  setTheme(!isDarkMode);
});

input.addEventListener("input", () => {
  toggleSendButtonVisibility();
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  input.value = "";
  toggleSendButtonVisibility();

  thinkingMessageElement = document.createElement("div");
  thinkingMessageElement.classList.add("message", "bot", "thinking-indicator");
  thinkingMessageElement.textContent = "Gemini is thinking...";
  chatBox.appendChild(thinkingMessageElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (thinkingMessageElement && chatBox.contains(thinkingMessageElement)) {
      const thinkingMessage = thinkingMessageElement;
      thinkingMessageElement = null;
      chatBox.removeChild(thinkingMessage);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    appendMessage("bot", data.reply);
  } catch (error) {
    if (thinkingMessageElement && chatBox.contains(thinkingMessageElement)) {
      const thinkingMessage = thinkingMessageElement;
      thinkingMessageElement = null;
      chatBox.removeChild(thinkingMessage);
    }
    console.error("Error sending message to backend:", error);
    appendMessage("bot", `Sorry, I encountered an error: ${error.message}`);
  }
});

function appendMessage(sender, text) {
  const msgElement = document.createElement("div");
  msgElement.classList.add("message", sender);
  msgElement.innerHTML = marked.parse(text);
  chatBox.appendChild(msgElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
