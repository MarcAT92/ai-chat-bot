async function sendMessage(event) {
  event.preventDefault();
  const input = document.getElementById("message-input");
  const messagesDiv = document.querySelector(".messages");
  const message = input.value.trim();

  if (!message) return;

  // User message creation
  const userDiv = document.createElement("div");
  userDiv.className =
    "ml-auto max-w-[80%] bg-blue-600 text-white p-3 rounded-lg";
  userDiv.textContent = message;
  messagesDiv.appendChild(userDiv);

  // AI loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.className =
    "mr-auto max-w-[80%] bg-gray-800 text-white p-3 rounded-lg flex items-center gap-2";
  loadingDiv.innerHTML = `
    <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
    <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-150"></div>
    <div class="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-300"></div>
  `;
  messagesDiv.appendChild(loadingDiv);

  // Auto-scroll to bottom
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      }),
    });

    const data = await response.json();

    // Replace loading indicator with actual AI response
    loadingDiv.className =
      "mr-auto max-w-[80%] bg-gray-800 text-white p-3 rounded-lg";
    loadingDiv.textContent = data.response;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
    loadingDiv.className =
      "mr-auto max-w-[80%] bg-red-900 text-white p-3 rounded-lg";
    loadingDiv.textContent = "Sorry, I couldn't process your request.";
  }
}

// Add event listener for Enter key (send on Enter, new line on Shift+Enter)
document
  .getElementById("message-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event);
    }
  });
