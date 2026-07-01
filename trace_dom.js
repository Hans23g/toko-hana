const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

console.log('Initializing JSDOM...');

const dom = new JSDOM(indexHtml, {
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
  url: "http://localhost/"
});

// Capture all logs
dom.window.console.log = (...args) => console.log('[DOM LOG]:', ...args);
dom.window.console.error = (...args) => console.error('[DOM ERROR]:', ...args);
dom.window.console.warn = (...args) => console.warn('[DOM WARN]:', ...args);

dom.window.addEventListener('error', (event) => {
  console.error('[WINDOW ERROR]:', event.error || event.message);
});

// Check window properties after 500ms
setTimeout(() => {
  console.log('--- Window Properties after 500ms ---');
  console.log('React loaded:', !!dom.window.React);
  console.log('ReactDOM loaded:', !!dom.window.ReactDOM);
  console.log('lucide loaded:', !!dom.window.lucide);
  console.log('supabase loaded:', !!dom.window.supabase);
  console.log('supabaseService loaded:', !!dom.window.supabaseService);
  console.log('tailwind loaded:', !!dom.window.tailwind);
  console.log('BRAND_LOGO_DATA_URI loaded:', !!dom.window.BRAND_LOGO_DATA_URI);
}, 500);

// Wait 2000ms
setTimeout(() => {
  console.log('--- Final Check ---');
  const root = dom.window.document.getElementById('root');
  if (root) {
    console.log('Root HTML length:', root.innerHTML.length);
    console.log('Root HTML content:', root.innerHTML);
  }
  process.exit(0);
}, 2000);
