const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const axe = require('axe-core');

(async () => {
  const filePath = path.resolve(__dirname, '..', 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');

  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
  const { window } = dom;

  // Inject axe-core source into the JSDOM window
  window.eval(axe.source);

  // Run axe in the JSDOM environment
  const results = await window.axe.run(window.document, {
    rules: {
      // keep defaults but we can tweak if needed
    }
  });

  const outPath = path.resolve(__dirname, '..', 'accessibility-report.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log('Accessibility audit complete. Results written to', outPath);

  const violations = results.violations || [];
  console.log(`Found ${violations.length} violations.`);
  violations.slice(0, 8).forEach((v, i) => {
    console.log(`${i + 1}. (${v.id}) ${v.impact} — ${v.description}`);
    console.log('   Help:', v.helpUrl);
  });

  // Exit with non-zero code if violations exist
  process.exit(violations.length > 0 ? 2 : 0);
})();