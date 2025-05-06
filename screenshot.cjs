const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // GitHub Actions may run on localhost:4173 by default for vite preview
  await page.setViewport({ width: 1280, height: 832 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  await browser.close();
})();