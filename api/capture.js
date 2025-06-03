import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: "https://manisprasad.github.io/capture/",
    methods: ["GET", "POST"]
}));

app.get('/' , (req, res) => {
    res.json({
        message: "Helo dude"
    })
})

app.get('/capture', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: 'new', // use 'true' if you're on a server without a display
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.goto('https://manisprasad.github.io/capture/', {
            waitUntil: 'networkidle0'
        });

        // Optional: Set viewport if needed
        await page.setViewport({ width: 1200, height: 800 });

        // Get full-page screenshot as buffer
        const screenshotBuffer = await page.screenshot({
            fullPage: true,
            type: 'png'
        });

        await browser.close();

        // Send screenshot as image response
        res.set('Content-Type', 'image/png');
        res.send(screenshotBuffer);
    } catch (error) {
        console.error('Screenshot capture failed:', error);
        res.status(500).send('Screenshot capture failed');
    }
});

app.listen(PORT, () => {
    console.log(`Screenshot server running on http://localhost:${PORT}`);
});
