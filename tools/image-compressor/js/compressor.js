/* ==========================================
   Toolora - compressor.js
   Part 1
========================================== */

let originalFile = null;
let compressedBlob = null;

async function compressImage() {

    if (!originalFile) {
        showToast("Please select an image first.", "error");
        return;
    }

    const quality =
        Number(document.getElementById("quality").value) / 100;

    const widthInput =
        document.getElementById("widthInput");

    const heightInput =
        document.getElementById("heightInput");

    const format =
        document.getElementById("format").value;

    const img = new Image();

    img.onload = () => {

        const canvas = document.createElement("canvas");

        const ctx = canvas.getContext("2d");

        let width =
            widthInput.value
                ? Number(widthInput.value)
                : img.width;

        let height =
            heightInput.value
                ? Number(heightInput.value)
                : img.height;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        animateProgress();

        canvas.toBlob(

            (blob) => {

                compressedBlob = blob;

                displayCompressedImage(blob);

            },

            format,

            quality

        );

    };

    img.src = URL.createObjectURL(originalFile);

}


/* ==========================
   Preview Result
========================== */

function displayCompressedImage(blob) {

    const url =
        URL.createObjectURL(blob);

    document.getElementById("resultImage").src =
        url;

    const kb =
        (blob.size / 1024).toFixed(2);

    document.getElementById("newSize").textContent =
        kb + " KB";

    const diffPercent =
        (
            (
                (originalFile.size - blob.size)
                /
                originalFile.size
            ) * 100
        ).toFixed(1);

    const savedLabel =
        document.getElementById("savedLabel");

    const savedEl =
        document.getElementById("saved");

    if (diffPercent >= 0) {

        if (savedLabel) savedLabel.textContent = "Saved :";

        savedEl.textContent = diffPercent + "%";

        savedEl.classList.remove("size-increase");

        showToast(
            "Compression completed!",
            "success"
        );

    } else {

        // The output is larger than the original (can happen at
        // high quality/PNG settings or upscaled dimensions).
        if (savedLabel) savedLabel.textContent = "Increased :";

        savedEl.textContent = Math.abs(diffPercent) + "%";

        savedEl.classList.add("size-increase");

        showToast(
            "File got larger — try a lower quality or different format.",
            "error"
        );

    }

}


/* ==========================
   Progress Animation
========================== */

function animateProgress() {

    const card =
        document.querySelector(".progress-card");

    card.style.display = "block";

    const bar =
        document.getElementById("progressBar");

    let value = 0;

    bar.style.width = "0%";

    const timer = setInterval(() => {

        value += 4;

        bar.style.width = value + "%";

        if (value >= 100) {

            clearInterval(timer);

        }

    }, 25);

}
/* ==========================================
   Toolora - compressor.js
   Part 2 (Final)
========================================== */

/* Download Image */

function downloadCompressedImage() {

    if (!compressedBlob) {
        showToast("No compressed image available.", "error");
        return;
    }

    const extension = getExtension(
        document.getElementById("format").value
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(compressedBlob);

    link.download = "compressed-image." + extension;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);

}


/* Get File Extension */

function getExtension(type){

    switch(type){

        case "image/png":
            return "png";

        case "image/webp":
            return "webp";

        default:
            return "jpg";
    }

}


/* Validate Image */

function validateImage(file){

    if(!file)
        return false;

    const allowed = [

        "image/jpeg",

        "image/png",

        "image/webp"

    ];

    if(!allowed.includes(file.type)){

        showToast(
            "Only JPG, PNG and WEBP are supported.",
            "error"
        );

        return false;

    }

    const maxSize = 20 * 1024 * 1024;

    if(file.size > maxSize){

        showToast(
            "Maximum file size is 20 MB.",
            "error"
        );

        return false;

    }

    return true;

}


/* Reset Compressor */

function resetCompressor(){

    compressedBlob = null;

    document.getElementById("resultImage").src = "";

    document.getElementById("newSize").textContent = "-";

    const savedEl =
        document.getElementById("saved");

    savedEl.textContent = "-";

    savedEl.classList.remove("size-increase");

    const savedLabel =
        document.getElementById("savedLabel");

    if (savedLabel) savedLabel.textContent = "Saved :";

    document.getElementById("progressBar").style.width = "0%";

    document.querySelector(".progress-card").style.display = "none";

}


/* Format Bytes */

function formatBytes(bytes){

    if(bytes < 1024){

        return bytes + " Bytes";

    }

    if(bytes < 1024 * 1024){

        return (bytes / 1024).toFixed(2) + " KB";

    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}


/* Original Image Info */

function updateOriginalInfo(file){

    document.getElementById("fileName").textContent =
        file.name;

    document.getElementById("fileSize").textContent =
        formatBytes(file.size);

}


/* Load Image Resolution */

function updateResolution(file){

    const img = new Image();

    img.onload = () => {

        document.getElementById("resolution").textContent =
            img.width + " × " + img.height;

        document.getElementById("widthInput").value =
            img.width;

        document.getElementById("heightInput").value =
            img.height;

    };

    img.src = URL.createObjectURL(file);

}