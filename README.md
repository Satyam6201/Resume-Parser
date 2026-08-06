# 📄 AI Resume Parser

Welcome to the **AI Resume Parser**! This is a complete, production-ready web application built with **Node.js** and **Express.js** that takes a PDF resume and magically transforms it into beautifully structured JSON data. 

Whether you're building an HR platform, an applicant tracking system (ATS), or just automating your own workflows, this tool accurately extracts the exact data you need without relying on expensive external APIs.

---

## ✨ Features

- **🎯 Highly Accurate Extraction:** Intelligently identifies and isolates sections like Experience, Education, Projects, and Skills.
- **🖼️ Profile Image Extraction:** Automatically scans the PDF for embedded profile images and saves them!
- **🛡️ Strict JSON Schema:** Guarantees a consistent JSON structure. No hallucinations, no merging of unrelated sections, and no empty strings—missing data simply returns `null`.
- **💅 Premium UI:** Features a state-of-the-art, dark-mode Glassmorphism interface with drag-and-drop support and smooth micro-animations.
- **🧩 Modular Architecture:** Every parser (Education, Experience, Projects) has its own dedicated file, making the code incredibly easy to maintain and upgrade.

---

## 🛠️ Technology Stack

- **Backend:** Node.js (Latest LTS), Express.js
- **PDF Processing:** `pdf-parse` (with custom overrides for image extraction)
- **Frontend:** Vanilla HTML5, CSS3 (Glassmorphism design), and plain JavaScript. No heavy frameworks!
- **Extraction Engine:** Advanced Heuristics, Regex, and Natural JavaScript string processing.

---

## 📁 Folder Structure

We kept things clean and modular. Here's how the project is organized:

```text
ai-resume-parser/
│
├── server.js                   # The main entry point. Starts the Express server.
│
├── controllers/
│   └── resumeController.js     # Handles incoming API requests and file uploads.
│
├── services/
│   ├── pdfService.js           # Reads the PDF, extracts text, and extracts profile images!
│   └── parserService.js        # The brain. Routes extracted text to the right parsers.
│
├── parsers/                    # Independent modules that parse specific sections:
│   ├── achievementParser.js    # Extracts achievements & awards
│   ├── certificationParser.js  # Extracts certifications
│   ├── educationParser.js      # Formats degrees, colleges, and CGPAs
│   ├── experienceParser.js     # Extracts job titles, companies, and durations
│   ├── personalParser.js       # Extracts emails, phones, github, linkedin, etc.
│   ├── projectsParser.js       # Extracts project names, live links, and tech stacks
│   ├── skillsParser.js         # Categorizes skills (Languages, Frameworks, etc.)
│   └── summaryParser.js        # Extracts the professional summary
│
├── utils/
│   ├── helpers.js              # Helper functions (cleaning text, fixing bullets)
│   ├── regex.js                # A centralized dictionary of Regular Expressions
│   └── sectionDetector.js      # Intelligently splits the resume into distinct sections
│
├── public/                     # The frontend UI (what you see in the browser)
│   ├── index.html              # The structure of the web page
│   ├── script.js               # Handles drag-and-drop and API calls to the backend
│   └── style.css               # The beautiful Glassmorphism styling
│
└── uploads/                    # Temporary storage for uploaded resumes
    └── profile/                # Extracted candidate profile pictures are saved here!
```

---

## 🚀 How to Run the Project Locally

1. **Install Dependencies:**
   Make sure you have Node.js installed. Open your terminal in the project folder and run:
   ```bash
   npm install
   ```

2. **Start the Server:**
   You can run the server in development mode (which auto-restarts on changes) using:
   ```bash
   npm run dev
   ```
   *Or simply run `node server.js`.*

3. **Open the App:**
   Open your browser and visit: **http://localhost:3000**

4. **Test it Out!**
   Drag and drop a PDF resume into the glowing drop zone. Click **Extract JSON Data**, and watch the magic happen!

---

## 🧠 How the Parser Works (The Pipeline)

When you upload a resume, it goes through a strict pipeline to ensure data accuracy:

1. **PDF Reading (`pdfService.js`):** We use `pdf-parse` to grab all the raw text. We also intercept the PDF's rendering instructions to look for embedded JPEGs (profile images).
2. **Text Normalization (`helpers.js`):** We clean up the raw text, fix bullet points (like converting `●` to standard dashes), and prevent accidental line-merging.
3. **Section Detection (`sectionDetector.js`):** We scan the document line-by-line looking for headers (like "PROFESSIONAL EXPERIENCE" or "EDUCATION"). Once a header is found, all text below it belongs strictly to that section until the next header appears.
4. **Independent Parsing (`parsers/`):** The isolated text block for each section is sent to its specific parser. Because the parsers are separate, your "Experience" parser will never accidentally consume your "Projects" data!