const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const fileNameDisplay = document.getElementById("file-name");
const uploadBtn = document.getElementById("upload-btn");
const loader = document.getElementById("loader");
const errorCard = document.getElementById("error-message");
const resultSection = document.getElementById("result-section");
const jsonViewer = document.getElementById("json-viewer");
const copyBtn = document.getElementById("copy-btn");
const downloadBtn = document.getElementById("download-btn");
const resetBtn = document.getElementById("reset-btn");
const uploadSection = document.getElementById("upload-section");

let selectedFile = null;
let parsedData = null;

// Drag and Drop Logic
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
  
  if (e.dataTransfer.files.length > 0) {
    handleFile(e.dataTransfer.files[0]);
  }
});

fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

function handleFile(file) {
  errorCard.classList.add("hidden");
  
  if (file.type !== "application/pdf") {
    showError("Invalid file type. Please upload a PDF.");
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    showError("File size exceeds 5MB limit.");
    return;
  }

  selectedFile = file;
  fileNameDisplay.textContent = file.name;
  uploadBtn.disabled = false;
}

function showError(msg) {
  errorCard.textContent = msg;
  errorCard.classList.remove("hidden");
  selectedFile = null;
  fileNameDisplay.textContent = "";
  uploadBtn.disabled = true;
}

// Upload and Parse
uploadBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append("resume", selectedFile);

  uploadSection.classList.add("hidden");
  loader.classList.remove("hidden");
  errorCard.classList.add("hidden");

  try {
    const response = await fetch("http://localhost:3000/api/parse-resume", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to parse resume");
    }

    parsedData = data;
    displayResult(data);
  } catch (error) {
    showError(error.message);
    uploadSection.classList.remove("hidden");
  } finally {
    loader.classList.add("hidden");
  }
});

// Display JSON with Syntax Highlighting
function displayResult(data) {
  resultSection.classList.remove("hidden");
  const jsonStr = JSON.stringify(data, null, 2);
  jsonViewer.innerHTML = syntaxHighlight(jsonStr);
}

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

// Buttons Logic
copyBtn.addEventListener("click", () => {
  if (parsedData) {
    navigator.clipboard.writeText(JSON.stringify(parsedData, null, 2));
    copyBtn.textContent = "Copied!";
    setTimeout(() => { copyBtn.textContent = "Copy JSON"; }, 2000);
  }
});

downloadBtn.addEventListener("click", () => {
  if (parsedData) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(parsedData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "parsed_resume.json");
    dlAnchorElem.click();
  }
});

resetBtn.addEventListener("click", () => {
  selectedFile = null;
  parsedData = null;
  fileInput.value = "";
  fileNameDisplay.textContent = "";
  uploadBtn.disabled = true;
  
  resultSection.classList.add("hidden");
  uploadSection.classList.remove("hidden");
});