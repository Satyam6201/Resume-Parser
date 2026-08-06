const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { parseResume } = require("../controllers/resumeController");

router.post("/parse-resume", upload.single("resume"), parseResume); 

module.exports = router;