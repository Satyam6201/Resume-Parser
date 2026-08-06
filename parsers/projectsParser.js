const { DATE_RANGE_REGEX, SINGLE_DATE_REGEX, URL_REGEX, GITHUB_REGEX } = require('../utils/regex');
const { stripMatch, isLikelyHeader } = require('../utils/helpers');
const { parseSkills } = require('./skillsParser');

const splitProjectsIntoChunks = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const chunks = [];
  let currentChunk = [];
  let inDescription = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBullet = /^[•*\-▪◦➢>·]/.test(line);
    const hasDate = DATE_RANGE_REGEX.test(line) || SINGLE_DATE_REGEX.test(line);
    
    const hasLink = URL_REGEX.test(line) || /github|live|demo/i.test(line); 

    const nextLineHasDate = (i + 1 < lines.length) && (DATE_RANGE_REGEX.test(lines[i+1]) || SINGLE_DATE_REGEX.test(lines[i+1]));
    const isHeaderStart = !isBullet && (hasDate || hasLink || (isLikelyHeader(line) && nextLineHasDate));

    if (inDescription) {
      if (isHeaderStart) {
        chunks.push(currentChunk);
        currentChunk = [line];
        inDescription = false;
      } else {
        currentChunk.push(line);
      }
    } else {
      currentChunk.push(line);
      if (isBullet || (!isLikelyHeader(line) && !hasDate && !hasLink)) {
        inDescription = true;
      }
    }
  }
  if (currentChunk.length > 0) chunks.push(currentChunk);
  return chunks;
};

const parseProjects = (projectText) => {
  if (!projectText) return [];

  const projects = [];
  const chunks = splitProjectsIntoChunks(projectText);

  for (const chunkLines of chunks) {
    if (chunkLines.length === 0) continue;

    const currentProject = {
      projectName: '',
      description: '',
      technologiesUsed: [],
      githubLink: ''
    };

    let headerLines = [];
    let descLines = [];
    
    let foundBullets = false;
    for (let i = 0; i < chunkLines.length; i++) {
      if (/^[•*\-▪◦➢>·]/.test(chunkLines[i])) foundBullets = true;
      
      if (foundBullets || (!isLikelyHeader(chunkLines[i]) && !DATE_RANGE_REGEX.test(chunkLines[i]) && !SINGLE_DATE_REGEX.test(chunkLines[i]) && !URL_REGEX.test(chunkLines[i]))) {
        descLines.push(chunkLines[i]);
      } else {
        headerLines.push(chunkLines[i]);
      }
    }

    if (headerLines.length === 0) {
      headerLines = [chunkLines[0]];
      descLines = chunkLines.slice(1);
    }

    let headerText = headerLines.join(' | ');

    // Extract GitHub
    const githubMatch = headerText.match(GITHUB_REGEX) || headerText.match(/github\.com\/[^\s]+/i);
    if (githubMatch) {
      currentProject.githubLink = githubMatch[0].trim();
      if (!currentProject.githubLink.startsWith('http')) currentProject.githubLink = 'https://' + currentProject.githubLink;
      headerText = stripMatch(headerText, githubMatch[0]);
    }
    
    // Extract Live Link
    const allUrls = headerText.match(new RegExp(URL_REGEX.source, "gi")) || [];
    for (const url of allUrls) {
      currentProject.liveLink = url.trim();
      if (!currentProject.liveLink.startsWith('http')) currentProject.liveLink = 'https://' + currentProject.liveLink;
      headerText = stripMatch(headerText, url);
      break; // just take the first one that isn't github
    }

    // Remaining text is likely the project name
    const remainingTokens = headerText.split('|').map(t => t.trim()).filter(t => t.length > 1);
    if (remainingTokens.length > 0) {
      currentProject.projectName = remainingTokens[0].replace(/—?\s*(github|live|demo).*/i, '').trim();
    }

    // Extract Description
    let descriptionText = '';
    const cleanDescLines = descLines.map(l => l.replace(/^[•*\-▪◦➢>·]\s*/, '').trim());
    if (cleanDescLines.length > 0) {
       descriptionText = cleanDescLines.join('\n');
       currentProject.description = descriptionText;
    }

    projects.push(currentProject);
  }

  // Deduplicate and extract technologies
  const uniqueProj = [];
  const seen = new Set();
  
  for (const proj of projects) {
    if (!proj.projectName && !proj.description && !proj.githubLink) continue;

    const allText = proj.projectName + ' ' + proj.description;
    const techs = parseSkills(allText);
    const techSet = new Set([
      ...(techs.programmingLanguages || []),
      ...(techs.frameworks || []),
      ...(techs.libraries || []),
      ...(techs.databases || []),
      ...(techs.tools || []),
      ...(techs.technologies || [])
    ]);
    
    proj.technologiesUsed = Array.from(techSet).filter(t => t);

    const key = (proj.projectName).toLowerCase().replace(/\s+/g, '');
    if (!seen.has(key)) {
      seen.add(key);
      uniqueProj.push(proj);
    }
  }

  return uniqueProj;
};

module.exports = {
  parseProjects,
};