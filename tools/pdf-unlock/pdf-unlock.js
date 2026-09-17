// ==============================
// Toolora PDF Unlock — 100% client-side
// No server. No uploads. Decryption runs entirely in this browser tab
// using qpdf compiled to WebAssembly.
// ==============================

const fileInput = document.getElementById("pdfFile");
const browseBtn = document.getElementById("browseBtn");
const dropZone = document.getElementById("dropZone");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");

const password = document.getElementById("password");

const unlockBtn = document.getElementById("unlockBtn");

const progressBar = document.getElementById("progressBar");
const statusText = document.getElementById("status");

let selectedFile = null;
let qpdfModulePromise = null;

// Lazily initialize the qpdf WASM module the first time it's needed,
// and reuse the same instance for subsequent unlocks in this tab.
function getQpdf() {
    if (!qpdfModulePromise) {
        qpdfModulePromise = Module({
            locateFile: () => "qpdf.wasm",
            noInitialRun: true,
        });
    }
    return qpdfModulePromise;
}

// Warm up the module in the background so the first click feels fast.
getQpdf().catch((err) => {
    console.error("Failed to preload qpdf engine:", err);
});

// ==============================
// Browse File
// ==============================

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    if (!fileInput.files.length) return;
    setSelectedFile(fileInput.files[0]);
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
    setSelectedFile(e.dataTransfer.files[0]);
});

function setSelectedFile(file) {
    selectedFile = file;
    fileName.textContent = file.name;
    fileInfo.classList.add("visible");
    statusText.textContent = "Selected: " + file.name;
}

// ==============================
// Unlock PDF — fully client-side
// ==============================

unlockBtn.addEventListener("click", async () => {

    if (!selectedFile) {
        alert("Please select a PDF.");
        return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
        alert("Please choose a PDF file.");
        return;
    }

    if (password.value === "") {
        alert("Please enter the PDF's current password.");
        return;
    }

    unlockBtn.disabled = true;

    try {
        progressBar.style.width = "15%";
        statusText.textContent = "Starting unlock engine...";

        const qpdf = await getQpdf();

        progressBar.style.width = "35%";
        statusText.textContent = "Reading PDF...";

        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);

        const inputPath = "/input.pdf";
        const outputPath = "/output.pdf";

        qpdf.FS.writeFile(inputPath, pdfBytes);

        progressBar.style.width = "60%";
        statusText.textContent = "Removing password protection...";

        const exitCode = qpdf.callMain([
            "--password=" + password.value,
            inputPath,
            "--decrypt",
            outputPath
        ]);

        // qpdf returns a non-zero exit code (rather than throwing) when the
        // password is wrong or the file can't be processed.
        if (exitCode !== 0) {
            cleanupFs(qpdf, inputPath, outputPath);
            throw new Error(
                "Incorrect password, or this file isn't a password-protected PDF."
            );
        }

        const outputBytes = qpdf.FS.readFile(outputPath);
        cleanupFs(qpdf, inputPath, outputPath);

        progressBar.style.width = "90%";
        statusText.textContent = "Preparing download...";

        const blob = new Blob([outputBytes], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "unlocked.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        progressBar.style.width = "100%";
        statusText.textContent = "✅ PDF Unlocked Successfully";

    }
    catch (err) {
        console.error(err);
        progressBar.style.width = "0%";
        statusText.textContent = "❌ Failed";

        alert(
            "Unable to unlock the PDF.\n\n" +
            (err.message || "Unknown error occurred.")
        );
    }
    finally {
        unlockBtn.disabled = false;
    }

});

function cleanupFs(qpdf, ...paths) {
    for (const p of paths) {
        try {
            qpdf.FS.unlink(p);
        } catch (e) {
            // file may not exist if a step failed early — safe to ignore
        }
    }
}
