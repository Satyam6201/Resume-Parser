const { URL_REGEX } = require('../utils/regex');

const parseCertifications = (certText) => {
  if (!certText) return [];

  const lines = certText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const certs = [];

  for (const line of lines) {
    const cleanLine = line.replace(/^[•*\-▪◦➢>·●]\s*/, '').trim();
   
    if (cleanLine.length > 5 && !cleanLine.includes('http')) {
      if (/^certifications?:/i.test(cleanLine)) {
         const certList = cleanLine.replace(/^certifications?:\s*/i, '').split(',').map(c => c.trim()).filter(c => c.length > 0);
         certs.push(...certList);
      } else if (!/achievement|winner|solved/i.test(cleanLine)) {
         certs.push(cleanLine);
      }
    }
  }

  return [...new Set(certs)];
};

module.exports = {
  parseCertifications,
};