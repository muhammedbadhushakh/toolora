// ==============================
// Toolora PDF Password Protector — 100% client-side
// No server. No uploads. Encryption runs entirely in this browser tab.
// ==============================

const fileInput = document.getElementById("pdfFile");
const browseBtn = document.getElementById("browseBtn");
const dropZone = document.getElementById("dropZone");

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const protectBtn = document.getElementById("protectBtn");

const progressBar = document.getElementById("progressBar");
const statusText = document.getElementById("status");

let selectedFile = null;

// ==============================
// Browse File
// ==============================

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    if (!fileInput.files.length) return;
    selectedFile = fileInput.files[0];
    statusText.textContent = "Selected: " + selectedFile.name;
});

// ==============================
// Drag & Drop
// ==============================

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag");

    if (!e.dataTransfer.files.length) return;

    selectedFile = e.dataTransfer.files[0];
    statusText.textContent = "Selected: " + selectedFile.name;
});

// ==============================
// Protect PDF — fully client-side
// ==============================

protectBtn.addEventListener("click", async () => {

    if (!selectedFile) {
        alert("Please select a PDF.");
        return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
        alert("Please choose a PDF file.");
        return;
    }

    if (password.value.trim() === "") {
        alert("Please enter a password.");
        return;
    }

    if (password.value.length < 4) {
        alert("Password must contain at least 4 characters.");
        return;
    }

    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match.");
        return;
    }

    try {
        progressBar.style.width = "20%";
        statusText.textContent = "Reading PDF...";

        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);

        progressBar.style.width = "50%";
        statusText.textContent = "Encrypting PDF in your browser...";

        const encryptedBytes = await window.PDFProtector.encryptPDF(
            pdfBytes,
            password.value
        );

        progressBar.style.width = "90%";
        statusText.textContent = "Preparing download...";

        const blob = new Blob([encryptedBytes], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "protected.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        progressBar.style.width = "100%";
        statusText.textContent = "✅ PDF Protected Successfully";

    }
    catch (err) {
        console.error(err);
        progressBar.style.width = "0%";
        statusText.textContent = "❌ Failed";

        alert(
            "Unable to protect the PDF.\n\n" +
            (err.message || "Unknown error occurred.")
        );
    }

});
