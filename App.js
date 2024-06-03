const puppeter = require("puppeteer");
const cheerio = require("cheerio");

async function initializeBrowser(url) {
  const browser = await puppeter.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
}

//usage example
const page = await initializeBrowser("https://mastdon.social/explore.com");

async function extractingImages(page) {
  const images = await page.$$eval("img", (elements) =>
    elements.map((img) => img.src)
  );
  return images;
}

//usage example
const images = await extractingImages(page);
console.log("Images", images);

async function extractTextContent(page) {
  const htmlContent = await page.content();
  const $ = cheerio.load(htmlContent);

  const textContent = [];
  $("h1, h2, h3, h4, p").each((index, element) => {
    const content = $(element).text().trim();
    textContent.push(content);
  });
  return textContent;
}

//usage example
const textContent = await extractTextContent(page);
console.log("Text Content:", textContent);

