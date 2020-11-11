## Web Scrapper



## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
This is a web scrapper

There are many like it, but this is mine
	
## Technologies
Project is created with:
* Node.js
* Cherrio
* request-promise
	
## Setup
```
$ cd ../crawlers
$ npm install
$ node crawler.js [--site --word --max ]
```
Options:
By Default, crawler will beging at 'https://www.giantbomb.com/' and seach for 'Games' with a max page search of 10 pages
to change these arguments in the cli, add the starting URL after the site option, the word you searching for after word option, and how many pages max you want the web crawler to visit.
For example
TODO
``` node crawler.js --site 'https://www.bbc.com/' --word '' --max 20
