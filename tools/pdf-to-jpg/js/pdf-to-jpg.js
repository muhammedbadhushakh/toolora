
// ===============================
// Toolora - PDF to JPG
// ===============================

const pdfInput = document.getElementById("pdfInput");
const pdfDrop = document.getElementById("pdfDrop");
const pdfPreview = document.getElementById("pdfPreview");
const convertBtn = document.getElementById("convertBtn");
const downloadZipBtn = document.getElementById("downloadZipBtn");
const loader = document.getElementById("loader");

let pdfFile = null;
let images = [];

// ===============================
// File Selection
// ===============================

pdfInput.addEventListener("change", (e) => {
    pdfFile = e.target.files[0];
});

// Drag & Drop
pdfDrop.addEventListener("dragover", (e) => {
    e.preventDefault();
    pdfDrop.classList.add("dragover");
});

pdfDrop.addEventListener("dragleave", () => {
    pdfDrop.classList.remove("dragover");
});

pdfDrop.addEventListener("drop", (e) => {
    e.preventDefault();
    pdfDrop.classList.remove("dragover");

    pdfFile = e.dataTransfer.files[0];
});

// ===============================
// Convert PDF to Images
// ===============================

convertBtn.addEventListener("click", async () => {

    if (!pdfFile) {
        alert("Please upload a PDF file!");
        return;
    }

    loader.classList.add("active");

    const fileReader = new FileReader();

    fileReader.onload = async function () {

        const typedarray = new Uint8Array(this.result);

        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

        pdfPreview.innerHTML = "";
        images = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

            const page = await pdf.getPage(pageNum);

            const viewport = page.getViewport({ scale: 2 });

            const canvas = document.createElement("canvas");

            const ctx = canvas.getContext("2d");

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: ctx,
                viewport: viewport
            }).promise;

            const imgData = canvas.toDataURL("image/jpeg", 1.0);

            images.push({
                name: `page-${pageNum}.jpg`,
                data: imgData
            });

            // UI Preview Card
            const card = document.createElement("div");
            card.className = "pdf-page";

            card.innerHTML = `
                <img src="${imgData}">
                <div class="page-info">
                    <h4>Page ${pageNum}</h4>
                </div>
            `;

            pdfPreview.appendChild(card);
        }

        loader.classList.remove("active");
    };

    fileReader.readAsArrayBuffer(pdfFile);
});

// ===============================
// Download ZIP (JSZip)
// ===============================

downloadZipBtn.addEventListener("click", async () => {

    if (images.length === 0) {
        alert("Convert PDF first!");
        return;
    }

    const zip = new JSZip();

    images.forEach(img => {
        const base64 = img.data.split(",")[1];
        zip.file(img.name, base64, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "toolora-pages.zip";
    link.click();
});