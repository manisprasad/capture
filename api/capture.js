import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

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
    const executablePath = await chromium.executablePath;

    if (!executablePath) {
      throw new Error("Chromium executable path not found. This only works on Vercel or AWS Lambda.");
    }

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
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
