const parseSummary = (summaryText) => {
  if (!summaryText) return "";
  return summaryText
    .replace(/^[•*\-▪◦➢>·]\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
};

module.exports = {
  parseSummary,
};