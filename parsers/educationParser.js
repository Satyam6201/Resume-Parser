const { DATE_RANGE_REGEX, SINGLE_DATE_REGEX, CGPA_REGEX } = require('../utils/regex');
const { stripMatch } = require('../utils/helpers');

const parseEducation = (educationText) => {
  if (!educationText) return [];

  const lines = educationText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const educations = [];

  let currentEducation = {
    degree: '',
    college: '',
    university: '',
    cgpa: '',
    percentage: '',
    startYear: '',
    endYear: ''
  };

  const finalizeEducation = () => {
    if (currentEducation.degree || currentEducation.college || currentEducation.university) {
      // Basic cleanup
      if (!currentEducation.degree && currentEducation.college) {
        const degreeKeywords = /bachelor|master|b\.tech|m\.tech|b\.sc|b\.e|b\.a|m\.a|mba|phd|diploma|intermediate|high school/i;
        if (degreeKeywords.test(currentEducation.college)) {
           currentEducation.degree = currentEducation.college;
           currentEducation.college = '';
        }
      }
      
      // Cleanup dates
      const years = [];
      if (currentEducation.startYear) {
         const d = currentEducation.startYear.match(/\d{4}/g);
         if (d) years.push(...d);
      }
      if (currentEducation.endYear) {
         const d = currentEducation.endYear.match(/\d{4}/g);
         if (d) years.push(...d);
      }

      if (years.length >= 2) {
         currentEducation.startYear = years[0];
         currentEducation.endYear = years[years.length - 1];
      } else if (years.length === 1) {
         currentEducation.endYear = years[0];
         currentEducation.startYear = '';
      }

      educations.push({ ...currentEducation });
    }
    currentEducation = {
      degree: '',
      college: '',
      university: '',
      cgpa: '',
      percentage: '',
      startYear: '',
      endYear: ''
    };
  };

  const degreeKeywords = /bachelor|master|b\.tech|m\.tech|b\.sc|b\.e|b\.a|m\.a|mba|phd|diploma|intermediate|high school|12th|10th/i;
  const universityKeywords = /university|institute|college|school|academy|vidyalaya|board/i;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Detect a boundary that suggests a new education block
    if (degreeKeywords.test(line) && (currentEducation.degree || currentEducation.college)) {
       finalizeEducation();
    } else if (DATE_RANGE_REGEX.test(line) && currentEducation.endYear) {
       finalizeEducation();
    }

    // Extract Dates
    const dateRangeMatch = line.match(DATE_RANGE_REGEX);
    if (dateRangeMatch) {
      currentEducation.startYear = dateRangeMatch[0];
      currentEducation.endYear = dateRangeMatch[0]; 
      line = stripMatch(line, dateRangeMatch[0]);
    } else {
      const singleDate = line.match(SINGLE_DATE_REGEX);
      if (singleDate && !currentEducation.endYear) {
        currentEducation.endYear = singleDate[0].trim();
        line = stripMatch(line, singleDate[0]);
      }
    }

    // Extract CGPA/Percentage
    const cgpaMatch = line.match(CGPA_REGEX);
    if (cgpaMatch) {
      const val = cgpaMatch[1].trim();
      if (val.includes('%')) {
        currentEducation.percentage = val;
      } else {
        currentEducation.cgpa = val;
      }
      line = line.replace(cgpaMatch[0], "").trim();
    }

    // Assign remaining text to degree, college or university
    const tokens = line.split(/[|,-]/).map(t => t.trim()).filter(t => t.length > 2);
    for (const token of tokens) {
      if (degreeKeywords.test(token) && !currentEducation.degree) {
        currentEducation.degree = token;
      } else if (universityKeywords.test(token)) {
        if (/university/i.test(token) && !currentEducation.university) {
          currentEducation.university = token;
        } else {
          if (currentEducation.college && !universityKeywords.test(currentEducation.college)) {
            // The existing college is probably the branch, append it to degree
            currentEducation.degree = currentEducation.degree ? currentEducation.degree + ' - ' + currentEducation.college : currentEducation.college;
          }
          currentEducation.college = token;
        }
      } else {
        // Fallback
        if (!currentEducation.degree && degreeKeywords.test(token)) currentEducation.degree = token;
        else if (!currentEducation.college) currentEducation.college = token;
      }
    }
  }

  finalizeEducation();
  return educations;
};

module.exports = {
  parseEducation,
};