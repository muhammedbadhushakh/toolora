// ==============================
// Toolora PDF Merger
// Part 1
// ==============================

const pdfInput = document.getElementById("pdfInput");
const browseBtn = document.getElementById("browseBtn");
const pdfList = document.getElementById("pdfList");
const mergeBtn = document.getElementById("mergeBtn");
const clearBtn = document.getElementById("clearBtn");
const progressBar = document.getElementById("progressBar");
const statusText = document.getElementById("status");
const uploadCard = document.querySelector(".upload-card");

// Store selected PDFs
let pdfFiles = [];

// Open file picker
browseBtn.addEventListener("click", () => {
    pdfInput.click();
});

// Render selected PDF list
function renderList() {

    pdfList.innerHTML = "";

    if (pdfFiles.length === 0) {

        pdfList.innerHTML =
        `<li>No PDF selected.</li>`;

        return;
    }

    pdfFiles.forEach((file, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
        <div class="file-name">
            <i class="fa-solid fa-file-pdf"></i>
            ${file.name}
        </div>

        <button
            class="remove-btn"
            onclick="removePDF(${index})">

            <i class="fa-solid fa-xmark"></i>

        </button>
        `;

        pdfList.appendChild(li);

    });

}

// Remove single PDF
function removePDF(index){

    pdfFiles.splice(index,1);

    renderList();

}

// Clear all PDFs
clearBtn.addEventListener("click",()=>{

    pdfFiles=[];

    renderList();

    progressBar.style.width="0%";

    statusText.innerHTML="Waiting...";

});

// Initial message
renderList();

// ==============================
// Drag & Drop Support
// ==============================

uploadCard.addEventListener("dragover",(e)=>{

    e.preventDefault();

    uploadCard.style.borderColor="#2563eb";

    uploadCard.style.background="#eff6ff";

});

uploadCard.addEventListener("dragleave",()=>{

    uploadCard.style.borderColor="#93c5fd";

    uploadCard.style.background="#ffffff";

});

uploadCard.addEventListener("drop",(e)=>{

    e.preventDefault();

    uploadCard.style.borderColor="#93c5fd";

    uploadCard.style.background="#ffffff";

    const files = Array.from(e.dataTransfer.files);

    addPDFFiles(files);

});
// ==============================
// PDF Merge Function
// ==============================

mergeBtn.addEventListener("click", mergePDFs);

async function mergePDFs() {

    if (pdfFiles.length < 2) {
        alert("Please select at least 2 PDF files.");
        return;
    }

    try {

        mergeBtn.disabled = true;
        mergeBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Merging...';

        progressBar.style.width = "5%";
        statusText.innerHTML = "Preparing files...";

        // Create a new PDF
        const mergedPdf = await PDFLib.PDFDocument.create();

        // Merge each PDF
        for (let i = 0; i < pdfFiles.length; i++) {

            statusText.innerHTML =
            `Processing ${i + 1} of ${pdfFiles.length}...`;

            const arrayBuffer = await pdfFiles[i].arrayBuffer();

            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);

            const copiedPages =
                await mergedPdf.copyPages(pdf, pdf.getPageIndices());

            copiedPages.forEach(page => {
                mergedPdf.addPage(page);
            });

            const percent =
                Math.round(((i + 1) / pdfFiles.length) * 90);

            progressBar.style.width = percent + "%";
        }

        statusText.innerHTML = "Generating merged PDF...";

        const mergedBytes = await mergedPdf.save();

        progressBar.style.width = "100%";

        downloadMergedPDF(mergedBytes);

        statusText.innerHTML =
        "✅ Merge completed successfully!";

    }
    catch (error) {

        console.error(error);

        alert("Something went wrong while merging PDFs.");

        statusText.innerHTML = "Merge failed.";

        progressBar.style.width = "0%";

    }
    finally {

        mergeBtn.disabled = false;

        mergeBtn.innerHTML =
        '<i class="fa-solid fa-layer-group"></i> Merge PDF';

    }

}

// ==============================
// Download
// ==============================

function downloadMergedPDF(pdfBytes){

    const blob = new Blob(
        [pdfBytes],
        { type: "application/pdf" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Toolora-Merged.pdf";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}
// ==============================
// Premium Enhancements
// ==============================

// Prevent duplicate PDFs
function addPDFFiles(files) {

    files.forEach(file => {

        if (file.type !== "application/pdf") return;

        const exists = pdfFiles.some(existing =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        );

        if (!exists) {
            pdfFiles.push(file);
        }
    });

    renderList();
}

// Replace existing upload handlers with this function if desired
pdfInput.addEventListener("change", (e) => {
    addPDFFiles(Array.from(e.target.files));
    pdfInput.value = "";
});

// Display file size
function formatFileSize(bytes) {

    if (bytes < 1024)
        return bytes + " Bytes";

    if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(2) + " KB";

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// Update renderList() to include size
const oldRenderList = renderList;

renderList = function () {

    pdfList.innerHTML = "";

    if (pdfFiles.length === 0) {

        pdfList.innerHTML =
        "<li>No PDF selected.</li>";

        return;
    }

    pdfFiles.forEach((file, index) => {

        const li = document.createElement("li");

        li.draggable = true;

        li.dataset.index = index;

        li.innerHTML = `
        <div class="file-name">
            <i class="fa-solid fa-file-pdf"></i>

            <div>
                <strong>${file.name}</strong><br>
                <small>${formatFileSize(file.size)}</small>
            </div>

        </div>

        <button
        class="remove-btn"
        onclick="removePDF(${index})">

        <i class="fa-solid fa-trash"></i>

        </button>
        `;

        pdfList.appendChild(li);

    });

    enableDragSort();

};

// ==============================
// Drag to Reorder
// ==============================

function enableDragSort() {

    const items = pdfList.querySelectorAll("li");

    let draggedItem = null;

    items.forEach(item => {

        item.addEventListener("dragstart", () => {

            draggedItem = item;

            item.style.opacity = ".5";

        });

        item.addEventListener("dragend", () => {

            item.style.opacity = "1";

        });

        item.addEventListener("dragover", (e) => {

            e.preventDefault();

        });

        item.addEventListener("drop", () => {

            if (!draggedItem || draggedItem === item)
                return;

            const from =
                Number(draggedItem.dataset.index);

            const to =
                Number(item.dataset.index);

            const moved = pdfFiles.splice(from, 1)[0];

            pdfFiles.splice(to, 0, moved);

            renderList();

        });

    });

}

// Initial refresh
renderList();