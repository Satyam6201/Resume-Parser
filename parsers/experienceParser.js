const { DATE_RANGE_REGEX, SINGLE_DATE_REGEX, LOCATION_REGEX } = require('../utils/regex');
const { extractBullets, isLikelyHeader, stripMatch } = require('../utils/helpers');

const splitExperienceIntoChunks = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const chunks = [];
  let currentChunk = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // An experience chunk usually starts with a Date Range or a Header immediately followed by a Date Range
    const hasDate = DATE_RANGE_REGEX.test(line) || SINGLE_DATE_REGEX.test(line);
    const nextHasDate = (i + 1 < lines.length) && (DATE_RANGE_REGEX.test(lines[i+1]) || SINGLE_DATE_REGEX.test(lines[i+1]));
    const prevHasDate = (i > 0) && (DATE_RANGE_REGEX.test(lines[i-1]) || SINGLE_DATE_REGEX.test(lines[i-1]));

    const isBullet = /^[•*\-▪◦➢>·●]/.test(line);
    
    // We start a new chunk if we see a likely header line and the next line has a date, OR if this line has a date and the previous didn't
    const isNewChunk = !isBullet && ((isLikelyHeader(line) && nextHasDate) || (hasDate && !prevHasDate));

    if (isNewChunk && currentChunk.length > 0) {
      // Don't split if currentChunk has no dates yet and we are just adding more context
      const chunkHasDate = currentChunk.some(l => DATE_RANGE_REGEX.test(l) || SINGLE_DATE_REGEX.test(l));
      if (chunkHasDate) {
         chunks.push(currentChunk);
         currentChunk = [];
      }
    }
    
    currentChunk.push(line);
  }
  
  if (currentChunk.length > 0) chunks.push(currentChunk);
  return chunks;
};

const parseExperience = (experienceText) => {
  if (!experienceText) return [];

  const experiences = [];
  const chunks = splitExperienceIntoChunks(experienceText);

  for (const chunkLines of chunks) {
    if (chunkLines.length === 0) continue;

    const currentExperience = {
      companyName: '',
      jobTitle: '',
      employmentDuration: '',
      location: '',
      responsibilities: []
    };

    let headerLines = [];
    let descLines = [];
    
    let foundBullets = false;
    let foundDate = false;

    for (let i = 0; i < chunkLines.length; i++) {
      const line = chunkLines[i];
      if (/^[•*\-▪◦➢>·●]/.test(line)) foundBullets = true;
      if (DATE_RANGE_REGEX.test(line) || SINGLE_DATE_REGEX.test(line)) foundDate = true;
      
      // If we found a bullet or we passed the date and it's a long text, it's description
      if (foundBullets || (foundDate && line.length > 60 && !isLikelyHeader(line))) {
        descLines.push(line);
      } else {
        headerLines.push(line);
      }
    }

    if (headerLines.length === 0) {
      headerLines = [chunkLines[0]];
      descLines = chunkLines.slice(1);
    }

    let headerText = headerLines.join(' | ');

    // Extract Dates
    const dateMatch = headerText.match(DATE_RANGE_REGEX);
    if (dateMatch) {
      currentExperience.employmentDuration = dateMatch[0].trim();
      headerText = stripMatch(headerText, dateMatch[0]);
    } else {
      const singleDate = headerText.match(SINGLE_DATE_REGEX);
      if (singleDate) {
        currentExperience.employmentDuration = singleDate[0].trim();
        headerText = stripMatch(headerText, singleDate[0]);
      }
    }

    // Extract Location
    const locMatch = headerText.match(LOCATION_REGEX);
    if (locMatch) {
      currentExperience.location = locMatch[0].trim();
      headerText = stripMatch(headerText, locMatch[0]);
    }

    // Extract Company & Designation
    let rawRemaining = headerText.replace(/\s+/g, ' ').trim();
    
    // Attempt to split by delimiters
    const splitTokens = rawRemaining.split(/\s*[|\-–,]\s*/).filter(t => t.length > 2);

    if (splitTokens.length >= 2) {
      const titleKeywords = /engineer|developer|intern|manager|lead|architect|analyst|consultant|designer|director|founder|specialist/i;
      
      let titleIdx = -1;
      for (let i = 0; i < splitTokens.length; i++) {
        if (titleKeywords.test(splitTokens[i])) {
          titleIdx = i;
          break;
        }
      }

      if (titleIdx !== -1) {
        currentExperience.jobTitle = splitTokens[titleIdx];
        currentExperience.companyName = splitTokens.filter((_, idx) => idx !== titleIdx).join(' ');
      } else {
        currentExperience.jobTitle = splitTokens[0];
        currentExperience.companyName = splitTokens[splitTokens.length - 1];
      }
    } else if (splitTokens.length === 1) {
       currentExperience.jobTitle = splitTokens[0];
    }

    // Extract Responsibilities
    let bullets = extractBullets(descLines);
    bullets = bullets.map(b => b.replace(/\s+/g, ' ').trim()).filter(b => b.length > 0);
    
    if (bullets.length > 0) {
      currentExperience.responsibilities = [...new Set(bullets)];
    } else if (descLines.length > 0) {
      const rawTextDesc = descLines.join(' ').replace(/\s+/g, ' ').trim();
      const splitDesc = rawTextDesc.split('. ').filter(b => b.length > 0).map(b => b + '.');
      currentExperience.responsibilities = [...new Set(splitDesc)];
    }

    if (currentExperience.companyName || currentExperience.jobTitle || currentExperience.responsibilities.length > 0) {
      experiences.push(currentExperience);
    }
  }

  return experiences;
};

module.exports = {
  parseExperience,
};