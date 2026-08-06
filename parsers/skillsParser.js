const ALIAS_MAP = {
  "reactjs": "React.js",
  "react": "React.js",
  "react.js": "React.js",
  "nextjs": "Next.js",
  "next.js": "Next.js",
  "node": "Node.js",
  "nodejs": "Node.js",
  "node.js": "Node.js",
  "express": "Express.js",
  "expressjs": "Express.js",
  "express.js": "Express.js",
  "tailwind": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",
  "tailwind css": "Tailwind CSS",
  "rest": "REST API",
  "rest api": "REST API",
  "rest apis": "REST API",
  "kafka": "Apache Kafka",
  "apache kafka": "Apache Kafka",
  "prisma": "Prisma ORM",
  "prisma orm": "Prisma ORM",
  "html5": "HTML",
  "html": "HTML",
  "css3": "CSS",
  "css": "CSS",
  "vue": "Vue.js",
  "vuejs": "Vue.js",
  "vue.js": "Vue.js"
};

const DICTIONARY = {
  programmingLanguages: ["JavaScript", "Java", "Python", "C++", "C#", "Ruby", "TypeScript", "SQL", "HTML", "CSS", "PHP", "Go", "Swift", "Kotlin", "Rust", "Dart", "C"],
  frameworks: ["React.js", "Next.js", "Express.js", "Spring Boot", "Angular", "Vue.js", "Django", "Flask", "Tailwind CSS", "Bootstrap", "Laravel", "Ruby on Rails", "Nest.js", "FastAPI"],
  libraries: ["Redux", "Shadcn UI", "Material UI", "Lodash", "jQuery", "Mongoose", "Sequelize", "Prisma ORM", "Socket.io", "Pandas", "NumPy", "TensorFlow", "PyTorch"],
  databases: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "Oracle", "SQLite", "DynamoDB", "Cassandra", "MariaDB", "Elasticsearch"],
  tools: ["Git", "GitHub", "Postman", "Jira", "Webpack", "Vite", "Figma", "Bitbucket", "GitLab", "Trello", "Confluence", "VS Code", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "AWS"],
  technologies: ["REST API", "JWT", "JWT Auth", "RBAC", "Apache Kafka", "OpenAI API", "CI/CD", "MVC", "MVC Architecture", "GraphQL", "WebSockets", "Microservices", "OAuth", "API Security", "Authentication & Authorization"]
};

const parseSkills = (skillsText) => {
  const result = {
    programmingLanguages: new Set(),
    frameworks: new Set(),
    libraries: new Set(),
    databases: new Set(),
    tools: new Set(),
    technologies: new Set()
  };

  if (!skillsText) return {
    programmingLanguages: [], frameworks: [], libraries: [], databases: [], tools: [], technologies: []
  };

  const text = skillsText.replace(/\n/g, " ");

  // Extract keys dynamically but normalize them before adding
  const searchKeywords = [
    ...Object.keys(ALIAS_MAP),
    ...Object.values(DICTIONARY).flat()
  ];

  for (const [category, keywords] of Object.entries(DICTIONARY)) {
    for (const keyword of keywords) {
      // Find aliases that map to this keyword, or the keyword itself
      const searchTerms = Object.keys(ALIAS_MAP).filter(k => ALIAS_MAP[k] === keyword);
      if (searchTerms.length === 0) searchTerms.push(keyword);

      for (const term of searchTerms) {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(text)) {
          const normalized = ALIAS_MAP[term.toLowerCase()] || term;
          result[category].add(normalized);
        }
      }
    }
  }

  return {
    programmingLanguages: Array.from(result.programmingLanguages).sort(),
    frameworks: Array.from(result.frameworks).sort(),
    libraries: Array.from(result.libraries).sort(),
    databases: Array.from(result.databases).sort(),
    tools: Array.from(result.tools).sort(),
    technologies: Array.from(result.technologies).sort()
  };
};

module.exports = {
  parseSkills,
};