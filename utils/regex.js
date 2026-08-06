const DATE_RANGE_REGEX = /(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*(?:-|–|to)\s*(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|Present|Current|Now)/i;
const SINGLE_DATE_REGEX = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\b\d{4}\b/i;
const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/i;
const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
const PHONE_REGEX = /(\+?\d[\d -]{8,14}\d)/;
const NAME_REGEX = /^\s*([A-Z][a-zA-Z]*(?:\s[A-Z][a-zA-Z]*){1,3})/m;
const CGPA_REGEX = /(?:CGPA|GPA)[\s:]*([1-4]\.\d{1,2}|\d{1,2}%)/i;

module.exports = {
  DATE_RANGE_REGEX,
  SINGLE_DATE_REGEX,
  URL_REGEX,
  GITHUB_REGEX,
  LINKEDIN_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  NAME_REGEX,
  CGPA_REGEX
}; 