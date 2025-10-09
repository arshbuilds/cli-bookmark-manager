import { Command } from "commander";
import fs from "fs";
import path from "path";
import prompts from "prompts";

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

function addBookmark(bookmark) {
  console.log(`Adding item with URL: ${bookmark.url}`);
  let bookmarks = loadBookMarks();
  bookmarks.push(bookmark);
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookmarks, null, 2));
  console.log("Item added successfully!");
}

const addCommand = new Command("add")
  .description("Add a new item to the list")
  .argument("<url>", "Url of the item to add")
  .option("-t, --title <title>", "Optional title for the bookmark")
  .option("-g, --tags <tags>", "Optional comma-separated tags")
  .option("-n, --notes <notes>", "Optional notes")
  .action(async (url, options) => {
    let { title, tags, notes } = options;
    let bookmarks = loadBookMarks();
    if (!title || !tags || !notes) {
      const response = await prompts([
        {
          type: title ? null : "text",
          name: "title",
          message: "Title (optional):",
          initial: url,
        },
        {
          type: tags ? null : "text",
          name: "tags",
          message: "Tags (comma-separated, optional):",
        },
        {
          type: "text",
          name: "notes",
          message: "Notes (optional):",
        },
      ]);

      title = response.title || title || url;
      tags = response.tags
        ? response.tags.split(",").map((tag) => tag.trim())
        : tags || [];
      notes = response.notes || notes || "";
    } else {
      tags = tags.split(",").map((tag) => tag.trim());
    }

    const newBookmark = {
        id: bookmarks.length + 1,
        title: title,
        url: url,
        tags: tags,
        notes: notes,
        createdAt: new Date().toISOString(),
        metadata: {},
    };

    addBookmark(newBookmark);
  });

export default addCommand;
