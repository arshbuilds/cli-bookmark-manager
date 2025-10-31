import { Command } from "commander";
import fs from "fs";
import path from "path";
import open from "open";

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

const openCommand = new Command("open")
  .description("Opens the url in the default browser")
  .argument("[number]", "The index of bookmark to open in browser")
  .action((number) => {
    if (!number) {
      console.log("Please provide the bookmark number to open.");
    }
    let bookmarks = loadBookMarks();
    const index = parseInt(number, 10);
    if (isNaN(index) || index < 1 || index > bookmarks.length) {
      console.log("Invalid bookmark number.");
      return;
    }
    const bookmark = bookmarks[index - 1];
    console.log(`Opening URL: ${bookmark.url}`);
    open(bookmark.url);
  });

export default openCommand;
