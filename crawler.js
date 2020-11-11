const request = require('request-promise');
const fs = require('fs');
const cheerio = require('cheerio');
const URL = require('url-parse');
const { argv } = require('yargs');

const START_URL = argv.site || "https://www.giantbomb.com/";
const SEARCH_WORD = argv.word || "Games";
const MAX_PAGES_TO_VISIT = argv.max || 10;

const pagesVisited = {};
let numPagesVisited = 0;
const pagesToVisit = [];
const url = new URL(START_URL);
const baseUrl = url.protocol + "//" + url.hostname;
const allAbsoluteLinks = [];

const crawl = () => {
  let nextPage;
  if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log(`Max number of pages ${MAX_PAGES_TO_VISIT} reached`);
    return;
  }
  if (pagesToVisit.length === 0) {
    if (allAbsoluteLinks.length === 0) {
      console.log('No more pages to visit :(');
      return;
    }
    nextPage = allAbsoluteLinks.pop()
  } else {
    nextPage = pagesToVisit.pop();
  }

  if (nextPage in pagesVisited) {
    crawl();
  } else {
    visitPage(nextPage, crawl);
  }
}

//I bet I could use axios instead, but ill give request a spin

const visitPage = (url, cb) => {
  pagesVisited[url] = true;
  numPagesVisited++;
  console.log(`Visiting Page: ${url}`);
  console.log(`Visted ${numPagesVisited} pages`);

  request(url)
    .then((body) => {
      const $ = cheerio.load(body);
      let isWordFound = searchForWord($, SEARCH_WORD);
      if (isWordFound) {
        console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
      } else {
        collectInternalLinks($);
        cb();
      }
    })
    .catch(({ statusCode }) => {
      if (statusCode >= 400 && statusCode < 500) {
        console.log(statusCode);
        numPagesVisited--;
      }
      cb()
    })

}

const searchForWord = ($, word) => {
  const bodyText = $('html > body').text();
  if (bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
    return true;
  }
  return false
}

const collectInternalLinks = ($) => {
  const relativeLinks = $("a[href^='/']");
  console.log("Found " + relativeLinks.length + " relative links on page");
  relativeLinks.each(function () {
    pagesToVisit.push(baseUrl + $(this).attr('href'));
  });
  const absoluteLinks = $("a[href^='http']");
  absoluteLinks.each(function () {
    allAbsoluteLinks.push($(this).attr('href'));
  });
}

pagesToVisit.push(START_URL);
crawl();


