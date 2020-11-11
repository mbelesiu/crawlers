const fs = require('fs');
const request = require('request-promise');
const cheerio = require('cheerio');
const URL = require('url-parse');
const { argv } = require('yargs');

const START_URL = argv.site || 'https://www.giantbomb.com/';
const SEARCH_WORD = argv.html || null;
const MAX_PAGES_TO_VISIT = argv.max || 10;
const filename = argv.output || '/results/default.txt';

let pagesVisited = {};
let numPagesVisited = 0;
const pagesToVisit = [];
const url = new URL(START_URL);
const baseUrl = url.protocol + "//" + url.hostname;

const crawl = () => {
  if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log(`Max number of pages ${MAX_PAGES_TO_VISIT} reached`);
    return;
  }
  let nextPage = pagesToVisit.pop();
  if (nextPage in pageVisited) {
    crawl();
  } else {
    visitPage(nextPage, crawl);
  }
}

//I bet I could use axios instead, but ill give request a spin

const visitPage = (url, cb) => {
  pageVisited[url] = true;
  numPagesVisited++;
  console.log(`Visiting Page: ${pageToVisit}`);

  request(pageToVisit)
  .then((body) => {
    const $ = cheerio.load(body);
    // console.log(`Page title: ${$('title').text()}`);
    let isWordFound = searchForWord($, SEARCH_WORD);
    if (isWordFound) {
      collectInternalLinks($);
      crawl();
    }
  })
  .catch((err) => cb())

}

const searchForWord = ($, word) => {
  const bodyText = $('html > body').text();
  if (bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
    return true;
  }
  return false
}

const collectInternalLinks = ($) => {
  const allRelativeLinks = [];
  const allAbsoluteLinks = [];

  const relativeLinks = $("a[href^='/']");
  relativeLinks.each(() => {
    allRelativeLinks.push($(this).attr('href'));
  });

  const absoluteLinks = $("a[href^='http']");
  absoluteLinks.each(() => {
    allAbsoluteLinks.push($(this).attr('href'));
  });

  console.log("Found " + allRelativeLinks.length + " relative links");
  console.log("Found " + allAbsoluteLinks.length + " absolute links");
}

pageToVisit.push(START_URL);
crawl();