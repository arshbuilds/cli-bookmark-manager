import { Command } from "commander";
import fs from "fs";
import path from "path";
import Fuse from "fuse.js";

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

const searchCommand = new Command("search")
  .description("Search for items in the list")
  .argument("[query]", "Query string to search for")
  .option("-a, --all", "shows all bookmarks")
  .action((query, options) => {
    let bookmarks = loadBookMarks();
    if (options.all) {
        console.log("Showing all ${bookmarks.length} bookmarks:");
        console.log(bookmarks);
        return
    } 

    if (!query) {
        console.log("Please provide a query or use --all to show all bookmarks.");
        return;
    }  
    const fuse = new Fuse(bookmarks, {
      keys: ["title", "url", "tags", "notes"],
      threshold: 0.3,
    });
    const results = fuse.search(query).map(result => result.item);
     if (results.length === 0) {
      console.log(`❌ No bookmarks found for "${query}"`);
    } else {
      console.log(`🔎 Found ${results.length} result(s) for "${query}":`);
      results.forEach(b => console.log(`- [${b.id}] ${b.title} (${b.url})`));
    }
});

export default searchCommand;
