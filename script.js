const socket = io();
const PASSWORD = "A+N_1024";

function login() {
    const pass = document.getElementById("password").value;
    if (pass === PASSWORD) {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("chat-screen").style.display = "flex";
    } else {
        alert("Wrong password");
    }
}

function sendMessage() {
    const text = document.getElementById("msg").value;
    if (!text && document.getElementById("file").files.length === 0) return;

    const name = document.getElementById("name").value || "Anonymous";
    const pfp = document.getElementById("pfp").value || "https://via.placeholder.com/40";
    const fileInput = document.getElementById("file");

    let fileURL = null;
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileURL = URL.createObjectURL(file);
    }

    const msgObj = {
        text,
        name,
        pfp,
        fileURL,
        timestamp: new Date().toLocaleTimeString(),
        self: true
    };

    socket.emit("chatMessage", msgObj);

    document.getElementById("msg").value = "";
    fileInput.value = "";
}

socket.on("chatMessage", msg => {
    displayMessage(msg);
});

function displayMessage(msg) {
    const div = document.createElement("div");
    div.classList.add("msg");
    div.classList.add(msg.self ? "you" : "other");

    div.innerHTML = `
        <img src="${msg.pfp}">
        <div>
            <div class="bubble">
                <strong>${msg.name}</strong><br>
                ${msg.text ? msg.text : ""}
                ${msg.fileURL ? `<br><a href="${msg.fileURL}" target="_blank">📎 File</a>` : ""}
            </div>
            <div class="timestamp">${msg.timestamp}</div>
        </div>
    `;

    document.getElementById("messages").appendChild(div);
    div.scrollIntoView({ behavior: "smooth" });
}
