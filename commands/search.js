import { Command } from "commander";
import fs from "fs";
import path from "path";

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
    let results;
    if (options.all) {
      results = bookmarks;
    } else if (query) {
      results = bookmarks.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.url.toLowerCase().includes(query.toLowerCase())
      );
    }else{
        console.log("Please provide a query or use --all to show all bookmarks.");
        return;
    }

    console.log(results);
  });

export default searchCommand;
