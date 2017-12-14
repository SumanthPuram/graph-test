const path = require('path');
const puppeteer = require('puppeteer');

const APP_URL = 'http://cryptofin.io/'; // Should be moved to config variables in heroku?

async function generateOgImage(symbol) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setViewport({ width: 1080, height: 1920 });

  await page.goto(`${APP_URL}coins/${symbol}`);
  await page.waitForSelector('.maincoin-line');
  const mainDiv = await page.$('.main');

  // Give {path: 'filePath'} to actually save the file
  const screenShot = await mainDiv.screenshot();
  await browser.close();
  return screenShot;
}

exports.getGraphImageForSymbol = async function getGraphImageForSymbol(req, res) {
  const { symbol } = req.params;
  // const filePath = `./public/assets/images/${symbol}.png`;
  const screenShot = await generateOgImage(symbol);
  const img = new Buffer(screenShot, 'base64');

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length,
  });
  res.end(img);
  return res;

  // const resolvedPath = path.resolve(filePath);
  // return res.status(200).sendFile(resolvedPath);
};
