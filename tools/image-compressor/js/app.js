/* ==========================================
   Toolora - app.js
   Main Application Controller
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const compressBtn = document.getElementById("compressBtn");

    /* ==========================
       Compress Button
    ========================== */

    compressBtn.addEventListener("click", async () => {

        if (!originalFile) {

            showToast("Please select an image first.", "error");
            return;

        }

        compressBtn.disabled = true;
        compressBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Compressing...';

        try {

            await compressImage();

        } catch (error) {

            console.error(error);

            showToast("Compression failed.", "error");

        } finally {

            compressBtn.disabled = false;
            compressBtn.innerHTML = "Compress Image";

        }

    });

    /* ==========================
       Auto Update Width & Height
    ========================== */

    const widthInput =
        document.getElementById("widthInput");

    const heightInput =
        document.getElementById("heightInput");

    widthInput.addEventListener("input", () => {

        if (!previewImage.src) return;

        const img = new Image();

        img.onload = () => {

            const ratio = img.height / img.width;

            heightInput.value =
                Math.round(widthInput.value * ratio);

        };

        img.src = previewImage.src;

    });

    /* ==========================
       Drag Hover Effect
    ========================== */

    dropArea.addEventListener("dragenter", () => {

        dropArea.style.transform = "scale(1.02)";

    });

    dropArea.addEventListener("dragleave", () => {

        dropArea.style.transform = "";

    });

    dropArea.addEventListener("drop", () => {

        dropArea.style.transform = "";

    });

    /* ==========================
       Lazy Reveal Animation
    ========================== */

    const revealElements =
        document.querySelectorAll(".card,.feature");

    const revealObserver =
        new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("fade-up");

                }

            });

        });

    revealElements.forEach(el => {

        revealObserver.observe(el);

    });

    /* ==========================
       Keyboard Shortcut
       Ctrl + D = Download
    ========================== */

    document.addEventListener("keydown", (e) => {

        if (e.ctrlKey && e.key.toLowerCase() === "d") {

            e.preventDefault();

            if (compressedBlob) {

                downloadCompressedImage();

            }

        }

    });

    /* ==========================
       Welcome Message
    ========================== */

    setTimeout(() => {

        showToast("Welcome to Toolora!", "success");

    }, 600);

});

/* ==========================================
   Utility
========================================== */

function resetApplication() {

    originalFile = null;

    compressedBlob = null;

    previewImage.src = "";

    document.getElementById("resultImage").src = "";

    document.getElementById("fileName").textContent = "-";

    document.getElementById("fileSize").textContent = "-";

    document.getElementById("resolution").textContent = "-";

    document.getElementById("newSize").textContent = "-";

    const savedEl2 =
        document.getElementById("saved");

    savedEl2.textContent = "-";

    savedEl2.classList.remove("size-increase");

    const savedLabel2 =
        document.getElementById("savedLabel");

    if (savedLabel2) savedLabel2.textContent = "Saved :";

    document.getElementById("progressBar").style.width = "0%";

    document.querySelector(".progress-card").style.display = "none";

}

/* ==========================================
   End of File
========================================== */