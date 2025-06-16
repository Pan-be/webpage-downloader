# Webpage Downloader with Puppeteer

A simple Node.js tool that downloads a full webpage including HTML, CSS, JS, and images, saving them locally with correct filenames. Built using [Puppeteer](https://github.com/puppeteer/puppeteer) for page rendering and resource extraction.

## Features

- Downloads the main HTML page.
- Extracts and downloads linked CSS, JS, and image files.
- Adjusts resource links in the saved HTML to point to local files.
- Asks for the target URL via command line prompt for flexibility.
- Sanitizes filenames to match those used in the page.

## Requirements

- Node.js (v16+ recommended)
- npm

## Installation

1. Clone or download this repository.
2. Run:

   ```bash
   npm install
