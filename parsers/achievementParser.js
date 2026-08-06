const parseAchievements = (achText) => {
  if (!achText) {
    return [];
  }

  const lines = achText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const achievements = [];

  for (const line of lines) {
    const cleanLine = line.replace(/^[•*\-▪◦➢>·●]\s*/, '').trim();
    if (cleanLine.length > 5 && !cleanLine.includes('http') && !/certifications?/i.test(cleanLine)) {
      achievements.push(cleanLine);
    }
  }

  return [...new Set(achievements)];
};

module.exports = {
  parseAchievements,
};