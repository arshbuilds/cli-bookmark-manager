import { Command } from "commander";
import fs from "fs";
import path from "path";
import Table from "cli-table3";

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

const showCommand = new Command("show")
  .description("Show all items in the list")
  .action(() => {
    let bookmarks = loadBookMarks();
    let table = new Table();
    bookmarks.forEach((b) =>
      table.push([b.id, b.title, b.url, b.tags ? b.tags.join(", ") : ""])
    );
    console.log(`Showing all ${bookmarks.length} bookmarks:`);
    console.log(table.toString());
  });

export default showCommand;
