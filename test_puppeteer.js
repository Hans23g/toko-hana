const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('Browser launched successfully!');
    const version = await browser.version();
    console.log('Browser version:', version);
    await browser.close();
  } catch (err) {
    console.error('Error launching browser:', err);
  }
})();
