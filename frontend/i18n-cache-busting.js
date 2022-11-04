const crypto = require('crypto');
const fs = require('fs');
const glob = require('glob');

const targetProject = process.argv[2];

if (!targetProject) {
  console.warn('\x1b[31m','[i18n:cache-busting] No target project provided. Provide target project as "npm run i18n:cache-busting org-app" ', '\x1b[0m');
  return;
}

function generateChecksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
}

const result = {};

glob.sync(`./projects/${targetProject}/src/assets/i18n/**/*.json`).forEach((path) => {
  const [_, lang] = path.split('src/assets/i18n/');
  const content = fs.readFileSync(path, { encoding: 'utf-8' });
  result[lang.replace('.json', '')] = generateChecksum(content);
});

fs.writeFileSync(`./projects/${targetProject}/i18n-cache-busting.json`, JSON.stringify(result));

console.warn('\x1b[32m','[i18n:cache-busting] Successfully generated i18n cached file', '\x1b[0m');
