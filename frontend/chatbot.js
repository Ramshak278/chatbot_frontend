const CHAT_API = "https://chatbotbackend-production-26f6.up.railway.app/api/chat";
const CALL_API = "https://resourceful-cooperation-production.up.railway.app/api/call";

const topQuestions = [
   "What is your pricing plan?",
   "Can I port my existing phone number?",
   "Does your service support call recording?",
   "Do you offer integrations with CRM tools?",
   "Is there a mobile app available?",
];

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const form = document.getElementById("chat-form");

function addMessage(message, from = "user") {
  const msg = document.createElement("div");
  msg.className = from;
  msg.textContent = message;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTopQuestions() {
  topQuestions.forEach(q => {
    const btn = document.createElement("button");
    btn.innerText = q;
    btn.onclick = () => sendMessage(q);
    chatBox.appendChild(btn);
  });
}

async function sendMessage(message) {
  addMessage(message, "user");

  const res = await fetch(CHAT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  addMessage(data.response, "bot");

  // If bot suggests talking to human, show call button
  if (data.response.toLowerCase().includes("talk to a human")) {
    const callBtn = document.createElement("button");
    callBtn.innerText = "Call an agent";
    callBtn.onclick = () => {
      const phone = prompt("Enter your phone number:");
      if (phone) {
        fetch(CALL_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: phone })
        });
      }
    };
    chatBox.appendChild(callBtn);
  }
}

form.onsubmit = (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    sendMessage(message);
    input.value = "";
  }
};

window.onload = showTopQuestions;
