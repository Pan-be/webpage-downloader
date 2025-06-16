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
   ```

## Usage 

Run the script with:

```bash
node scrape.js
```

You will be prompted to enter the URL of the webpage you want to download:

```bash
Provide url:
```
Type or paste the URL and press Enter.

The script will:

    Launch a headless browser,

    Fetch the page and wait for network idle,

    Download all detected CSS, JS, and image resources into the assets/ folder,

    Save the updated HTML as index.html in the current directory.

## Project Structure

```bash
/assets         # Downloaded CSS, JS, and images
index.html     # Downloaded and modified HTML page
scrape.js      # Main script
package.json   # Node.js dependencies and metadata
.gitignore     # Files and folders ignored by Git
README.md      # This file
```

## License
MIT License

## Author
[Pan-Be](https://pan-be.com)
