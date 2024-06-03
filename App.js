// 1.Getting Started
// npm install puppeteer
// npm install cheerio
// npm install image-downloader
// npm install objects-to-csv

// 2.Writing the Scraper Script:

const puppeter = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

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

async function extractVideoLinks(page) {
  const htmlContent = await page.content();
  const $ = cheerio.load(htmlContent);

  const videoLinks = [];
  $("a[href*=video]").each((index, element) => {
    const videoLink = $(element).attr("href");
    videoLink.push(videoLink);
  });

  return videoLinks;
}

//usage example
const videoLinks = await extractVideoLinks(page);
console.log("Video Links: ", videoLinks);

// 3.Organizing the Scraped Content
async function createFolders(outputFolder) {
  const csvFolder = path.join(__dirname, outputFolder, "csv");
  const imagesFolder = path.join(__dirname, outputFolder, "images");
  const jsonFolder = path.join(__dirname, outputFolder, "json");
  const textFolder = path.join(__dirname, outputFolder, "text");
  const videosFolder = path.join(__dirname, outputFolder, "videos");

  await Promise.all([
    fs.mkdir(csvFolder, { recursive: true }),
    fs.mkdir(imagesFolder, { recursive: true }),
    fs.mkdir(imagesFolder, { recursive: true }),
    fs.mkdir(jsonFolder, { recursive: true }),
    fs.mkdir(textFolder, { recursive: true }),
    fs.mkdir(videosFolder, { recursive: true }),
  ]);
}

// usage example
const outputFolder = "organized_content";
await createFolders(outputFolderu);

// Saving Scraped Content: After scraping each type of content (images, text, JSON, CSV, videos),
// save them into their respective folders.
async function saveImages(images, outputFolder) {
  const imgFolder = path.join(__dirname, outputFolder, "images");
  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i];
    const timestamp = new Date().getTime();
    const imageFileName = path.join(
      imgFolder,
      `ìmage_${timestamp}_${i + 1}.jpg`
    );

    try {
      await downloadImage(imageUrl, imageFileName);
    } catch (error) {
      console.log("Error saving image", error);
    }
  }
}

async function saveTextContent(textContent, outputFolder) {
  const textFileName = path.join(__dirname, outputFolder, 'text', 'text_content.txt');
  await fs.writeFile(textFileName, textContent.join('\n'), 'utf-8');
}
// Similar functions for saving JSON, CSV, and videos

