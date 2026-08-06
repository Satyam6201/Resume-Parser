const { detectSections } = require("../utils/sectionDetector");
const { normalizeText } = require("../utils/helpers");
const { parsePersonal } = require("../parsers/personalParser");
const { parseSummary } = require("../parsers/summaryParser");
const { parseSkills } = require("../parsers/skillsParser");
const { parseExperience } = require("../parsers/experienceParser");
const { parseEducation } = require("../parsers/educationParser");
const { parseProjects } = require("../parsers/projectsParser");
const { parseCertifications } = require("../parsers/certificationParser");
const { parseAchievements } = require("../parsers/achievementParser");

const parseResumeText = (rawText) => {
  const text = normalizeText(rawText);
  const sections = detectSections(text);

  const getSectionText = (key) => (sections[key] ? sections[key] : ""); 

  const headerText = getSectionText("PERSONAL") || text.substring(0, 1000);
  
  return {
    personalInformation: parsePersonal(headerText),
    professionalSummary: parseSummary(getSectionText("SUMMARY")),
    skills: parseSkills(getSectionText("SKILLS")),
    experience: parseExperience(getSectionText("EXPERIENCE")),
    education: parseEducation(getSectionText("EDUCATION")),
    projects: parseProjects(getSectionText("PROJECTS")),
    certifications: parseCertifications(getSectionText("CERTIFICATIONS") || getSectionText("ACHIEVEMENTS")),
    achievements: parseAchievements(getSectionText("ACHIEVEMENTS"))
  };
};

module.exports = {
  parseResumeText,
};