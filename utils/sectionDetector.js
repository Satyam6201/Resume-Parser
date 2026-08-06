const SECTION_MAPPING = [
  { key: 'SUMMARY', regex: /^(?:professional\s+)?(?:summary|profile|about|career\s+objective)/i },
  { key: 'SKILLS', regex: /^(?:technical\s+)?(?:skills|expertise|core\s+skills)/i },
  { key: 'EXPERIENCE', regex: /^(?:professional\s+|work\s+)?(?:experience|employment(?:\s+history)?)/i },
  { key: 'EDUCATION', regex: /^(?:academic\s+)?(?:background|education|qualifications)/i },
  { key: 'PROJECTS', regex: /^(?:academic\s+|personal\s+|featured\s+)?projects/i },
  { key: 'CERTIFICATIONS', regex: /^certifications?|certificates/i },
  { key: 'ACHIEVEMENTS', regex: /^(?:achievements|awards|honors|recognition)/i },
];

const detectSection = (line) => {
  const cleanLine = line.trim().replace(/[:_]/g, '');
  if (cleanLine.split(' ').length > 4) return null; // Headings are usually short
  if (cleanLine.endsWith('.')) return null; // Headers don't end in periods
  
  // If the line is entirely lowercase, 
  if (cleanLine === cleanLine.toLowerCase() && cleanLine.match(/[a-z]/)) return null;

  for (const section of SECTION_MAPPING) {
    if (section.regex.test(cleanLine)) {
      return section.key;
    }
  }
  return null;
};

const detectSections = (text) => {
  const lines = text.split('\n');
  const sections = {};
  
  let currentSection = 'PERSONAL'; 
  let currentContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const detected = detectSection(line);

    if (detected) {
      if (currentContent.length > 0) {
        if (!sections[currentSection]) sections[currentSection] = '';
        sections[currentSection] += currentContent.join('\n') + '\n';
      }
      currentSection = detected;
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // push last section
  if (currentContent.length > 0) {
    if (!sections[currentSection]) sections[currentSection] = '';
    sections[currentSection] += currentContent.join('\n') + '\n';
  }

  return sections;
};

module.exports = {
  detectSections,
}; 