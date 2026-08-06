# 📄 AI Resume Parser

Welcome to the **AI Resume Parser**! This is a complete, production-ready web application built with **Node.js** and **Express.js** that takes a PDF resume and magically transforms it into beautifully structured JSON data. 

Whether you're building an HR platform, an applicant tracking system (ATS), or just automating your own workflows, this tool accurately extracts the exact data you need without relying on expensive external APIs.

---

## ✨ Features

- **🎯 Highly Accurate Extraction:** Intelligently identifies and isolates sections like Experience, Education, Projects, and Skills without confusing them.
- **🖼️ Profile Image Extraction:** Automatically scans the PDF's internal rendering operators for embedded profile images (JPEGs/PNGs) and saves them locally!
- **🛡️ Strict JSON Schema:** Guarantees a consistent JSON structure. No hallucinations, no merging of unrelated sections, and no empty strings—missing data simply returns `null`.
- **💅 Premium UI:** Features a state-of-the-art, dark-mode Glassmorphism interface with drag-and-drop support, SVG icons, and smooth micro-animations.
- **🧩 Modular Architecture:** Every parser (Education, Experience, Projects) has its own dedicated Javascript file, making the logic incredibly easy to maintain, debug, and upgrade.
- **⚡ No External AI Required:** Uses an advanced Heuristic and Regex engine, meaning it runs entirely locally, extremely fast, and completely free.

---

## 🛠️ Technology Stack & Dependencies

This project relies on a minimal, highly efficient tech stack:

- **Node.js (Latest LTS):** The core runtime environment.
- **Express.js:** The web framework used to spin up the API and serve static frontend files.
- **pdf-parse:** A lightweight library used to parse and extract raw text from PDF files. We also customized its `pagerender` function to intercept image data.
- **multer:** Middleware for handling `multipart/form-data`, which is used for uploading the PDF files to the backend securely.
- **Vanilla HTML5, CSS3, & JavaScript:** Used for the beautiful frontend interface. No React, Next.js, or heavy frameworks are used on the client side, ensuring ultra-fast load times.
- **nodemon (Dev Dependency):** Used for automatically restarting the server during development.

---

## 🚀 Cloning & Installation Guide

If you are a developer looking to clone this repository and run it on your own machine, follow these exact steps:

### 1. Prerequisites
Make sure you have installed on your system:
- [Node.js](https://nodejs.org/) (Version 16.x or higher is recommended)
- [Git](https://git-scm.com/)

### 2. Clone the Repository
Open your terminal or command prompt and clone this project:
```bash
git clone https://github.com/your-username/ai-resume-parser.git
cd ai-resume-parser
```
*(Note: Replace the URL above with your actual repository URL)*

### 3. Install Dependencies
Once inside the project directory, install all the required Node.js packages (Express, multer, pdf-parse, etc.) by running:
```bash
npm install
```

### 4. Verify Folder Structure
Before running the server, ensure that the `uploads` directory exists. The application uses this directory to temporarily store uploaded resumes and save extracted profile pictures.
*If the `uploads/profile` folder doesn't exist, create it manually or let the app create it (if handled in code).*

### 5. Start the Server
To run the server in development mode (which automatically restarts when you change files):
```bash
npm run dev
```
Alternatively, for standard execution:
```bash
node server.js
```

### 6. Open the Application
The server will start on port 3000. Open your favorite web browser and navigate to:
**http://localhost:3000**

You will see the beautiful drag-and-drop interface. Try dropping a PDF resume into the drop zone and clicking "Extract JSON Data"!

---

## 📁 Folder Structure Explained

We kept things clean and modular so that anyone jumping into the codebase knows exactly where things are:

```text
ai-resume-parser/
│
├── server.js                   # The main entry point. Initializes Express, routes, and middleware.
│
├── controllers/
│   └── resumeController.js     # Handles incoming HTTP POST requests for PDF uploads and formats the final API response.
│
├── services/
│   ├── pdfService.js           # Core PDF processing. Extracts raw text and intercepts raw image buffers.
│   └── parserService.js        # The routing brain. Feeds the raw text through the section detector and calls the individual parsers.
│
├── parsers/                    # Independent modules containing the heuristic logic for specific resume sections:
│   ├── achievementParser.js    # Extracts achievements & awards
│   ├── certificationParser.js  # Extracts certifications
│   ├── educationParser.js      # Formats degrees, colleges, and CGPAs safely
│   ├── experienceParser.js     # Extracts job titles, companies, and durations
│   ├── personalParser.js       # Extracts emails, phones, github, linkedin, etc.
│   ├── projectsParser.js       # Extracts project names, live links, and tech stacks
│   ├── skillsParser.js         # Categorizes skills into arrays (Languages, Frameworks, etc.)
│   └── summaryParser.js        # Extracts the professional summary paragraph
│
├── utils/
│   ├── helpers.js              # Helper functions (normalizing text, fixing bullet formatting, cleaning delimiters)
│   ├── regex.js                # A centralized dictionary of Regular Expressions (Dates, URLs, Emails, etc.)
│   └── sectionDetector.js      # Intelligently slices the resume text into strict section blocks (e.g., stops reading Experience when it sees "PROJECTS")
│
├── public/                     # The static frontend UI files served by Express
│   ├── index.html              # The DOM structure (Glassmorphism layout)
│   ├── script.js               # Handles drag-and-drop events, fetch API calls, and syntax highlighting
│   └── style.css               # The beautiful dark-mode, animated CSS styling
│
├── uploads/                    # Local storage for files
│   ├── resume.pdf              # (Temp storage for the uploaded file)
│   └── profile/                # Extracted candidate profile pictures are saved here!
│
├── package.json                # Project metadata, scripts (npm run dev), and dependencies
└── README.md                   # The documentation file you are reading right now!
```

---

## 🧠 How the Parser Pipeline Works

When a user uploads a resume, it goes through a strict chronological pipeline to ensure data accuracy:

1. **Upload & Read (`pdfService.js`):** The PDF is uploaded via `multer` to the `uploads/` folder. We use `pdf-parse` to read the PDF and grab all the raw text. Concurrently, we intercept the PDF's rendering instructions to look for embedded JPEGs (profile images) and write them to disk.
2. **Text Normalization (`helpers.js`):** We clean up the raw text, fix bullet points (like converting custom symbols to standard dashes), and prevent accidental sentence merging.
3. **Section Boundary Detection (`sectionDetector.js`):** We scan the document line-by-line looking for headers (like "PROFESSIONAL EXPERIENCE" or "EDUCATION"). Once a header is found, all text below it belongs strictly to that section until the next header appears.
4. **Independent Parsing (`parsers/`):** The isolated text block for each section is sent to its specific parser module. Because the parsers operate in complete isolation, your "Experience" parser will never accidentally consume your "Projects" data, completely eliminating data bleeding!

---

Enjoy parsing! 🎉