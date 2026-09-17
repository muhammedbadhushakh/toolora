/* ==========================================
   Toolora - ui.js
   Part 1
========================================== */

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");
const previewImage = document.getElementById("previewImage");
const qualitySlider = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const themeBtn = document.getElementById("themeBtn");

/* ==========================
   Browse Button
========================== */

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

/* ==========================
   File Selection
========================== */

fileInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!validateImage(file)) return;

    originalFile = file;

    resetCompressor();

    updateOriginalInfo(file);

    updateResolution(file);

    previewImage.src = URL.createObjectURL(file);

});

/* ==========================
   Drag & Drop
========================== */

dropArea.addEventListener("dragover", (e) => {

    e.preventDefault();

    dropArea.classList.add("drag-over");

});

dropArea.addEventListener("dragleave", () => {

    dropArea.classList.remove("drag-over");

});

dropArea.addEventListener("drop", (e) => {

    e.preventDefault();

    dropArea.classList.remove("drag-over");

    const file = e.dataTransfer.files[0];

    if (!validateImage(file)) return;

    originalFile = file;

    resetCompressor();

    updateOriginalInfo(file);

    updateResolution(file);

    previewImage.src = URL.createObjectURL(file);

});

/* ==========================
   Quality Slider
========================== */

qualitySlider.addEventListener("input", () => {

    qualityValue.textContent =
        qualitySlider.value + "%";

});

/* ==========================
   Theme Toggle
========================== */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const icon = themeBtn.querySelector("i");

    if (document.body.classList.contains("dark")) {

        icon.className = "fa-solid fa-sun";

    } else {

        icon.className = "fa-solid fa-moon";

    }

});
/* ==========================================
   Toolora - ui.js
   Part 2 (Final)
========================================== */

/* ==========================
   Toast Notification
========================== */

function showToast(message, type = "success") {

    let toast = document.querySelector(".toast");

    if (!toast) {

        toast = document.createElement("div");
        toast.className = "toast";

        document.body.appendChild(toast);
    }

    toast.className = "toast " + type;
    toast.textContent = message;

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* ==========================
   FAQ Accordion
========================== */

document.querySelectorAll(".faq-item").forEach(item => {

    const button = item.querySelector("button");

    button.addEventListener("click", () => {

        document.querySelectorAll(".faq-item").forEach(faq => {

            if (faq !== item) {
                faq.classList.remove("active");
            }

        });

        item.classList.toggle("active");

    });

});


/* ==========================
   Reveal on Scroll
========================== */

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {
    threshold: 0.15
});

document.querySelectorAll(".card, .feature").forEach(el => {
    observer.observe(el);
});


/* ==========================
   Keyboard Shortcuts
========================== */

document.addEventListener("keydown", (e) => {

    // Ctrl + O = Open file picker
    if (e.ctrlKey && e.key.toLowerCase() === "o") {

        e.preventDefault();
        fileInput.click();

    }

    // Enter = Compress
    if (e.key === "Enter") {

        const btn = document.getElementById("compressBtn");

        if (btn) {
            btn.click();
        }

    }

});


/* ==========================
   Drag Area Highlight
========================== */

dropArea.addEventListener("dragenter", () => {
    dropArea.style.borderColor = "#2563eb";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.style.borderColor = "";
});


/* ==========================
   Initialize
========================== */

window.addEventListener("load", () => {

    qualityValue.textContent =
        qualitySlider.value + "%";

    showToast("Toolora Ready!", "success");

});