const path = require('path');
const puppeteer = require('puppeteer');
const { Chromeless } = require('chromeless');

const APP_URL = 'http://cryptofin.io/'; // Should be moved to config variables in heroku?

async function generateOgImage(symbol) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  let pages = await browser.pages();
  let page;

  if (pages.length === 1) {
    page = (await browser.pages())[0];
  } else {
    page = await browser.newPage();
  }
  page.on('error', async error => {
    console.error('Page error');
    console.error(error);
    // await page.close();
    await browser.close();
  });
  page.setViewport({ width: 1080, height: 1920 });

  await page.goto(`${APP_URL}coins/${symbol}`);
  await page.waitForSelector('.maincoin-line');
  const mainDiv = await page.$('.main');

  // Give {path: 'filePath'} to actually save the file
  const screenShot = await mainDiv.screenshot();
  await page.close();
  await browser.disconnect();
  return screenShot;
}

async function ChromelessRun(symbol) {
  const chromeless = new Chromeless();

  const screenshot = await chromeless
    .goto(`${APP_URL}coins/${symbol}`)
    .wait('.maincoin-line')
    .screenshot('.main');

  console.log(screenshot); // prints local file path or S3 url

  await chromeless.end();
  return screenshot;
}

exports.getGraphImageForSymbolOld = async function getGraphImageForSymbolOld(
  req,
  res
) {
  try {
    const { symbol } = req.params;
    // const filePath = `./public/assets/images/${symbol}.png`;
    const screenShot = await ChromelessRun(symbol);

    res.sendFile(screenShot);
    return res;
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something went wrong!');
  }

  // const resolvedPath = path.resolve(filePath);
  // return res.status(200).sendFile(resolvedPath);
};

exports.getGraphImageForSymbol = async function getGraphImageForSymbol(
  req,
  res
) {
  try {
    const { symbol } = req.params;
    // const filePath = `./public/assets/images/${symbol}.png`;
    const screenShot = await generateOgImage(symbol);
    const img = new Buffer(screenShot, 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
    return res;
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something went wrong!');
  }

  // const resolvedPath = path.resolve(filePath);
  // return res.status(200).sendFile(resolvedPath);
};
