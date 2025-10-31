import { Command } from "commander";
import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

const DATA_FILE = path.join(process.cwd(), "bookmarks.json");

function loadBookMarks() {
  if (!fs.existsSync(DATA_FILE)) return [];

  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.warn("⚠️ bookmarks.json is corrupted, resetting to empty array");
    return [];
  }
}

async function scrapeSite(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(data);
    return {
      title: $("title").text() || "",
      description: $('meta[name="description"]').attr("content") || "",
      keywords: $('meta[name="keywords"]').attr("content") || "",
      content: $("p").first().text() || "",
      favicon: $('link[rel="icon"]').attr("href") || "/favicon.ico",
      addedAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error(`Failed to fetch URL ${url}: `, e.message);
    return {};
  }
}

const syncCommand = new Command("sync")
  .description("Sync and populate metadata")
  .action(async () => {
    let bookmarks = loadBookMarks();
    const updatedBookmarks = await Promise.all(
      bookmarks.map(async (b) => {
        const metadata = await scrapeSite(b.url);
        return { ...b, metadata };
      })
    );
    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedBookmarks, null, 2));
  });

export default syncCommand;
