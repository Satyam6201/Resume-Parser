const {
  EMAIL_REGEX,
  PHONE_REGEX,
  LINKEDIN_REGEX,
  GITHUB_REGEX,
  URL_REGEX,
  NAME_REGEX,
} = require("../utils/regex");
const { normalizeUrl, normalizePhone } = require("../utils/helpers");

const parsePersonal = (headerText) => {
  if (!headerText) {
    return {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      portfolio: "",
      location: "",
    };
  }

  const emailMatch = headerText.match(EMAIL_REGEX);
  const email = emailMatch ? emailMatch[1].trim() : "";

  const phoneMatch = headerText.match(PHONE_REGEX);
  const nameMatch = headerText.match(NAME_REGEX);
  const linkedinMatch = headerText.match(LINKEDIN_REGEX);
  const githubMatch = headerText.match(GITHUB_REGEX);
  
  const allUrls = headerText.match(new RegExp(URL_REGEX.source, "gi")) || [];
  
  // Ignore standard email domains
  const ignoreDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"];
  
  let portfolio = "";
  for (const url of allUrls) {
    const lowerUrl = url.toLowerCase();
    if (!lowerUrl.includes("linkedin.com") && !lowerUrl.includes("github.com")) {
      let isEmailDomain = false;
      for (const domain of ignoreDomains) {
        if (lowerUrl.includes(domain)) {
          isEmailDomain = true;
          break;
        }
      }
      if (!isEmailDomain) {
        portfolio = url;
        break;
      }
    }
  }

  // Find location
  let location = "";
  const lines = headerText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  for (const line of lines) {
    if (line.length > 3 && line.length < 50) {
      if (!EMAIL_REGEX.test(line) && !PHONE_REGEX.test(line) && !URL_REGEX.test(line) && !NAME_REGEX.test(line)) {
        if (line.includes(",") || /\b([A-Z][a-zA-Z\s]+,?\s*[A-Z]{2})\b/.test(line)) {
          location = line;
          break;
        }
      }
    }
  }

  return {
    fullName: nameMatch ? nameMatch[1].trim() : "",
    email: email,
    phone: phoneMatch ? normalizePhone(phoneMatch[1]) : "",
    linkedin: linkedinMatch ? normalizeUrl(linkedinMatch[0]) : "",
    github: githubMatch ? normalizeUrl(githubMatch[0]) : "",
    portfolio: portfolio ? normalizeUrl(portfolio) : "",
    location: location,
  };
};

module.exports = {
  parsePersonal,
};