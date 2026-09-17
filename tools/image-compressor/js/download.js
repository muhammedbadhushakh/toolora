/* ==========================================
   Toolora - download.js
   Handles downloading compressed images
========================================== */

const downloadBtn = document.getElementById("downloadBtn");

/* ==========================
   Download Button
========================== */

downloadBtn.addEventListener("click", () => {

    downloadCompressedImage();

});


/* ==========================
   Auto Download (Optional)
========================== */

function autoDownload(delay = 0){

    if(!compressedBlob){

        showToast("Nothing to download.","error");

        return;
    }

    setTimeout(() => {

        downloadCompressedImage();

    }, delay);

}


/* ==========================
   Copy Image to Clipboard
========================== */

async function copyImage(){

    if(!compressedBlob){

        showToast("No compressed image.","error");

        return;
    }

    try{

        await navigator.clipboard.write([

            new ClipboardItem({

                [compressedBlob.type]: compressedBlob

            })

        ]);

        showToast("Image copied to clipboard.","success");

    }

    catch(error){

        console.error(error);

        showToast("Clipboard not supported.","error");

    }

}


/* ==========================
   Share Image
========================== */

async function shareImage(){

    if(!compressedBlob){

        showToast("No image to share.","error");

        return;

    }

    if(!navigator.canShare){

        showToast("Sharing is not supported on this browser.","error");

        return;

    }

    const extension = getExtension(compressedBlob.type);

    const file = new File(

        [compressedBlob],

        "compressed-image." + extension,

        {

            type: compressedBlob.type

        }

    );

    try{

        await navigator.share({

            title:"Compressed Image",

            text:"Compressed using Toolora",

            files:[file]

        });

    }

    catch(err){

        console.log(err);

    }

}


/* ==========================
   Save As
========================== */

function saveAs(filename){

    if(!compressedBlob){

        showToast("Nothing to save.","error");

        return;

    }

    const link=document.createElement("a");

    link.href=URL.createObjectURL(compressedBlob);

    link.download=filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}


/* ==========================================
   End of download.js
========================================== */