const readline = require("readline");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const urlModule = require("url");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith("https") ? https : http;
        client.get(url, (res) => {
            if (res.statusCode !== 200) return reject(`❌ ${url}: ${res.statusCode}`);
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on("finish", () => resolve());
        }).on("error", reject);
    });
};

const sanitizeFilename = (url) => {
    const pathname = urlModule.parse(url).pathname;
    return path.basename(pathname);
};

rl.question("Provide url: ", (inputUrl) => {
    rl.close();
    (async () => {
        const pageUrl = inputUrl.trim();
        const assetsDir = path.resolve(__dirname, "assets");
        if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(pageUrl, { waitUntil: "networkidle2" });

        const html = await page.content();

        const resourceUrls = await page.evaluate(() => {
            const urls = new Set();

            // HTML attributes
            document.querySelectorAll("link[rel='stylesheet']").forEach(el => el.href && urls.add(el.href));
            document.querySelectorAll("script[src]").forEach(el => urls.add(el.src));
            document.querySelectorAll("img[src]").forEach(el => urls.add(el.src));
            document.querySelectorAll("img[srcset]").forEach(el => {
                el.srcset.split(",").forEach(s => {
                    const u = s.trim().split(" ")[0];
                    if (u) urls.add(u);
                });
            });
            document.querySelectorAll("source[src]").forEach(el => urls.add(el.src));

            // Inline CSS background-images
            document.querySelectorAll("*[style]").forEach(el => {
                const style = el.getAttribute("style");
                const match = style.match(/url\(["']?(.*?)["']?\)/);
                if (match && match[1]) urls.add(match[1]);
            });

            return Array.from(urls);
        });

        console.log(`🔎 ${resourceUrls.length} resources found`);

        const updatedHtml = await resourceUrls.reduce(async (accP, resourceUrl) => {
            const acc = await accP;
            try {
                const filename = sanitizeFilename(resourceUrl);
                const filePath = path.join(assetsDir, filename);
                await downloadFile(resourceUrl, filePath);
                console.log(`⬇️  ${resourceUrl} → assets/${filename}`);
                return acc.replace(new RegExp(resourceUrl.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'), "g"), `assets/${filename}`);
            } catch (err) {
                console.warn(`⚠️  Can't fetch: ${resourceUrl}`);
                return acc;
            }
        }, Promise.resolve(html));

        fs.writeFileSync("index.html", updatedHtml, "utf-8");

        await browser.close();
        console.log("✅ Ready! Resources and index.html saved.");
    })();
});
