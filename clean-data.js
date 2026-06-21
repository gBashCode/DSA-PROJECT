const fs = require('fs');
const path = require('path');

const problemsDir = path.join(__dirname, 'src', 'data', 'problems');
const files = fs.readdirSync(problemsDir).filter(f => f.endsWith('.json'));

function cleanProblem(p) {
  return {
    id: p.id,
    leetcode: p.leetcode,
    title: p.title,
    difficulty: p.difficulty,
    link: p.link || `https://leetcode.com/problems/${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}/`
  };
}

let totalCleaned = 0;

for (const file of files) {
  const filePath = path.join(problemsDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let cleaned;
  let count = 0;

  if (Array.isArray(content) && content.length > 0 && content[0].section) {
    // Section format
    cleaned = content.map(section => ({
      section: section.section,
      problems: (section.problems || []).map(cleanProblem)
    }));
    count = cleaned.reduce((s, sec) => s + sec.problems.length, 0);
  } else if (Array.isArray(content)) {
    // Flat format
    cleaned = content.map(cleanProblem);
    count = cleaned.length;
  } else {
    continue;
  }

  fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2));
  totalCleaned += count;
  console.log(`Cleaned: ${file} (${count} problems)`);
}

console.log(`\nTotal: ${totalCleaned} problems cleaned`);
console.log('Removed: descriptions, solutions, examples, hints, timeComplexity, spaceComplexity');
console.log('Kept: id, leetcode, title, difficulty, link');
