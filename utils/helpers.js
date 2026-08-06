const normalizeText = (rawText) => {
  if (!rawText) return "";

  let text = rawText
    .replace(/[\u200B-\u200D\uFEFF]/g, "") 
    .replace(/[\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000]/g, " ") 
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  text = text.replace(/^[ \t]*[•*▪◦➢>·●]\s+/gm, "- ");
  text = text.replace(/[ ]{4,}/g, "\n");

  const lines = text.split("\n").map((line) => line.trim());
  const mergedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    if (currentLine.length === 0) {
      mergedLines.push("");
      continue;
    }

    const isBullet = currentLine.startsWith("- ");
    const isShort = currentLine.length < 50; 
    
    // Check if current line looks like it starts with a date or title delimiter
    const hasDelimiter = /^[-–|]/.test(currentLine) || /\d{4}/.test(currentLine);

    if (!isBullet && !isShort && !hasDelimiter && mergedLines.length > 0) {
      const prevLine = mergedLines[mergedLines.length - 1];
      if (
        prevLine.length > 0 &&
        !prevLine.endsWith(".") &&
        !prevLine.endsWith(":") &&
        !prevLine.startsWith("- ")
      ) {
        if (prevLine.length > 60 && !/https?:\/\//.test(prevLine) && !/\d{4}/.test(prevLine)) {
          mergedLines[mergedLines.length - 1] = prevLine + " " + currentLine;
          continue;
        }
      }
    }

    mergedLines.push(currentLine);
  }

  return mergedLines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const isLikelyHeader = (line) => {
  if (line.length > 100) return false;
  if (/^[•*\-▪◦➢>·●]/.test(line)) return false;
  if (line.endsWith(".")) return false;
  return true;
};

const extractBullets = (lines) => {
  return lines
    .filter((line) => /^[•*\-▪◦➢>·●]\s+/.test(line))
    .map((line) => line.replace(/^[•*\-▪◦➢>·●]\s*/, "").trim());
};

const stripMatch = (text, matchStr) => {
  if (!matchStr || !text) return text;
  return text.replace(matchStr, "").replace(/\s{2,}/g, " ").trim();
};

const normalizeUrl = (url) => {
  if (!url) return "";
  let clean = url.trim().toLowerCase();
  if (clean.endsWith("/")) clean = clean.slice(0, -1);
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    clean = "https://" + clean;
  }
  return clean;
};

const normalizePhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/[^\d+]/g, "").trim();
};

module.exports = {
  normalizeText,
  isLikelyHeader,
  extractBullets,
  stripMatch,
  normalizeUrl,
  normalizePhone
};