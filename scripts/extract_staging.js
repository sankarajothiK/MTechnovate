const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Fetching bundle.js.map from staging site...');
  const res = await fetch('https://mtech-staging.preview.emergentagent.com/static/js/bundle.js.map');
  const json = await res.json();

  const outDir = path.join(__dirname, 'extracted_staging');
  fs.mkdirSync(outDir, { recursive: true });

  const sources = json.sources || [];
  const sourcesContent = json.sourcesContent || [];

  console.log(`Total sources: ${sources.length}`);

  let count = 0;
  for (let i = 0; i < sources.length; i++) {
    const src = sources[i];
    if (src.includes('/app/frontend/src/')) {
      const relPath = src.split('/app/frontend/src/')[1];
      const targetPath = path.join(outDir, relPath);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, sourcesContent[i] || '', 'utf8');
      console.log(`Extracted: ${relPath}`);
      count++;
    }
  }

  console.log(`Successfully extracted ${count} source files!`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
