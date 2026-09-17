/*==================================================
    Toolora - PDF Page Rotator
    Part 3A
===================================================*/

// Elements
const pdfInput = document.getElementById("pdfInput");
const browseBtn = document.getElementById("browseBtn");
const dropZone = document.getElementById("dropZone");

const rotateBtn = document.getElementById("rotateBtn");
const downloadBtn = document.getElementById("downloadBtn");

const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const pageCount = document.getElementById("pageCount");

const pageInput = document.getElementById("pageInput");
const progressBar = document.getElementById("progressBar");

const toast = document.getElementById("toast");

let uploadedFile = null;
let pdfDoc = null;
let rotatedPdfBytes = null;
let selectedAngle = 90;

//==============================
// Browse Button
//==============================

browseBtn.addEventListener("click", () => {
    pdfInput.click();
});

//==============================
// File Selection
//==============================

pdfInput.addEventListener("change", (e) => {

    if (!e.target.files.length) return;

    loadPDF(e.target.files[0]);

});

//==============================
// Drag & Drop
//==============================

dropZone.addEventListener("dragover", (e) => {

    e.preventDefault();

    dropZone.classList.add("dragover");

});

dropZone.addEventListener("dragleave", () => {

    dropZone.classList.remove("dragover");

});

dropZone.addEventListener("drop", (e) => {

    e.preventDefault();

    dropZone.classList.remove("dragover");

    const file = e.dataTransfer.files[0];

    if (file) {

        loadPDF(file);

    }

});

//==============================
// Load PDF
//==============================

async function loadPDF(file) {

    if (file.type !== "application/pdf") {

        showToast("Please choose a PDF file.");

        return;

    }

    uploadedFile = file;

    fileName.textContent = file.name;

    fileSize.textContent =
        (file.size / 1024 / 1024).toFixed(2) + " MB";

    const bytes = await file.arrayBuffer();

    pdfDoc = await PDFLib.PDFDocument.load(bytes);

    pageCount.textContent = pdfDoc.getPageCount();

    progressBar.style.width = "0%";

    downloadBtn.disabled = true;

    showToast("PDF loaded successfully.");

}

//==============================
// Angle Selection
//==============================

document.querySelectorAll(".angle").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".angle")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        selectedAngle = parseInt(button.dataset.angle);

    });

});

//==============================
// Progress
//==============================

function setProgress(value) {

    progressBar.style.width = value + "%";

}

//==============================
// Toast
//==============================

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}
/*==================================================
    Toolora - PDF Page Rotator
    Part 3B
===================================================*/

//==============================
// Rotate PDF
//==============================

rotateBtn.addEventListener("click", async () => {

    if (!uploadedFile || !pdfDoc) {
        showToast("Please upload a PDF first.");
        return;
    }

    try {

        setProgress(10);

        const bytes = await uploadedFile.arrayBuffer();

        const pdf = await PDFLib.PDFDocument.load(bytes);

        const pages = pdf.getPages();

        const mode = document.querySelector(
            "input[name='mode']:checked"
        ).value;

        // Rotate all pages
        if (mode === "all") {

            pages.forEach(page => {

                const current = page.getRotation().angle;

                page.setRotation(
                    PDFLib.degrees(current + selectedAngle)
                );

            });

        }

        // Rotate selected pages
        else {

            if (!pageInput.value.trim()) {

                showToast("Enter page numbers.");

                return;

            }

            const selectedPages = pageInput.value
                .split(",")
                .map(p => parseInt(p.trim()))
                .filter(n => !isNaN(n));

            if (selectedPages.length === 0) {

                showToast("Invalid page numbers.");

                return;

            }

            selectedPages.forEach(number => {

                if (number >= 1 && number <= pages.length) {

                    const page = pages[number - 1];

                    const current = page.getRotation().angle;

                    page.setRotation(
                        PDFLib.degrees(current + selectedAngle)
                    );

                }

            });

        }

        setProgress(70);

        rotatedPdfBytes = await pdf.save();

        setProgress(100);

        downloadBtn.disabled = false;

        showToast("PDF rotated successfully!");

    }

    catch (err) {

        console.error(err);

        showToast("Rotation failed.");

    }

});

//==============================
// Download
//==============================

downloadBtn.addEventListener("click", () => {

    if (!rotatedPdfBytes) {

        showToast("Nothing to download.");

        return;

    }

    const blob = new Blob(
        [rotatedPdfBytes],
        { type: "application/pdf" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const original =
        uploadedFile.name.replace(".pdf", "");

    link.href = url;

    link.download =
        original + "-rotated.pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});

//==============================
// Enable / Disable Page Input
//==============================

document
.querySelectorAll("input[name='mode']")
.forEach(radio => {

    radio.addEventListener("change", () => {

        if (radio.checked) {

            pageInput.disabled =
                radio.value === "all";

            if (radio.value === "all") {

                pageInput.value = "";

            }

        }

    });

});

// Disable page input initially

pageInput.disabled = true;

//==============================
// Reset Tool
//==============================

function resetTool() {

    uploadedFile = null;

    pdfDoc = null;

    rotatedPdfBytes = null;

    fileName.textContent = "-";

    fileSize.textContent = "0 MB";

    pageCount.textContent = "0";

    pageInput.value = "";

    pageInput.disabled = true;

    progressBar.style.width = "0%";

    downloadBtn.disabled = true;

}

//==============================
// Optional:
// Double-click upload area
// resets everything
//==============================

dropZone.addEventListener("dblclick", () => {

    resetTool();

    showToast("Tool reset.");

});