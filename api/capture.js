import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import os from 'os';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "https://manisprasad.github.io/capture/",
  methods: ["GET", "POST"]
}));

app.get('/', (req, res) => {
  res.json({ message: "Hello dude" });
});

app.get('/capture', async (req, res) => {
  let browser = null;

  try {
    const isDev = !process.env.AWS_REGION; // Simple check to see if it's running locally

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: isDev
        ? '/path/to/your/local/chrome' // ✅ Replace with your local Chrome path
        : await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://manisprasad.github.io/capture/', {
      waitUntil: 'networkidle0',
    });

    await page.setViewport({ width: 1200, height: 800 });

    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      type: 'png',
    });

    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.send(screenshotBuffer);
  } catch (error) {
    if (browser) await browser.close();
    console.error('Screenshot capture failed:', error);
    res.status(500).send('Screenshot capture failed');
  }
});

app.listen(PORT, () => console.log("Serve is running"));
