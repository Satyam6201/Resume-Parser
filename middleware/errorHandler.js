const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.message && err.message.includes("Invalid file type")) {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File size exceeds 5MB limit." });
  }

  res.status(500).json({ error: "Internal Server Error during PDF parsing." });
};

module.exports = {
  errorHandler, 
};