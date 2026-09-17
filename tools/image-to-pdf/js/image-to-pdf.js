// ===============================
// Toolora - Image to PDF
// ===============================

const imageInput = document.getElementById("imageInput");
const dropArea = document.getElementById("dropArea");
const previewContainer = document.getElementById("previewContainer");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");
const loader = document.getElementById("loader");

let images = [];

// ===============================
// Upload Handling
// ===============================

imageInput.addEventListener("change", handleFiles);

function handleFiles(e) {
    const files = Array.from(e.target.files);
    addImages(files);
}

// Drag & Drop
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("dragover");

    const files = Array.from(e.dataTransfer.files);
    addImages(files);
});

// ===============================
// Add Images
// ===============================

function addImages(files) {

    files.forEach(file => {

        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();

        reader.onload = (e) => {

            images.push({
                file: file,
                src: e.target.result,
                rotation: 0
            });

            renderImages();
        };

        reader.readAsDataURL(file);
    });
}

// ===============================
// Render Preview
// ===============================

function renderImages() {

    previewContainer.innerHTML = "";

    images.forEach((img, index) => {

        const card = document.createElement("div");
        card.className = "preview-card";

        card.innerHTML = `
            <img src="${img.src}" style="transform:rotate(${img.rotation}deg)">
            
            <div class="preview-info">
                <h4>${img.file.name}</h4>
                <p>${(img.file.size / 1024).toFixed(1)} KB</p>

                <div class="preview-actions">

                    <button class="rotate-btn" onclick="rotateImage(${index})">
                        <i class="fa-solid fa-rotate"></i>
                    </button>

                    <button class="remove-btn" onclick="removeImage(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            </div>
        `;

        previewContainer.appendChild(card);
    });
}

// ===============================
// Rotate Image
// ===============================

window.rotateImage = function(index) {
    images[index].rotation += 90;
    renderImages();
};

// ===============================
// Remove Image
// ===============================

window.removeImage = function(index) {
    images.splice(index, 1);
    renderImages();
};

// ===============================
// Clear All
// ===============================

clearBtn.addEventListener("click", () => {
    images = [];
    renderImages();
});

// ===============================
// Create PDF
// ===============================

downloadBtn.addEventListener("click", async () => {

    if (images.length === 0) {
        alert("Please add images first!");
        return;
    }

    loader.classList.add("active");

    const { PDFDocument } = PDFLib;

    const pdfDoc = await PDFDocument.create();

    for (let img of images) {

        const imgBytes = await fetch(img.src).then(res => res.arrayBuffer());

        let embeddedImg;

        if (img.file.type === "image/png") {
            embeddedImg = await pdfDoc.embedPng(imgBytes);
        } else {
            embeddedImg = await pdfDoc.embedJpg(imgBytes);
        }

        const page = pdfDoc.addPage();

        const { width, height } = page.getSize();

        const imgDims = embeddedImg.scaleToFit(width, height);

        page.drawImage(embeddedImg, {
            x: (width - imgDims.width) / 2,
            y: (height - imgDims.height) / 2,
            width: imgDims.width,
            height: imgDims.height,
        });
    }

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "toolora-images.pdf";

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);

    loader.classList.remove("active");
});