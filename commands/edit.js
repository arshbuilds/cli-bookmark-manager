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

function saveBookmarks(bookmarks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookmarks, null, 2), "utf8");
}

const editCommand = new Command("edit")
  .description("Edit a bookmark by ID")
  .argument("<id>", "ID of the bookmark to edit")
  .option("-t, --title <title>", "New title")
  .option("-g, --tags <tags>", "New comma-separated tags")
  .option("-n, --notes <notes>", "New notes")
  .action(async (id, options) => {
    let { title, tags, notes } = options;
    let bookmarks = loadBookMarks();
    const bookmark = bookmarks.find((b) => b.id === parseInt(id));
    if (!title && !tags && !notes) {
      const responses = await prompts([
        {
          type: "text",
          name: "title",
          message: "New title:",
          initial: bookmark.title,
        },
        {
          type: "text",
          name: "tags",
          message: "New tags (comma-separated):",
          initial: bookmark.tags,
        },
        {
          type: "text",
          name: "notes",
          message: "New notes:",
          initial: bookmark.notes,
        },
      ]);

      title = responses.title;
      tags = responses.tags.split(",").map((t) => t.trim());
      notes = responses.notes;
    } else {
      if (tags) tags = tags.split(",").map((t) => t.trim());
      else tags = bookmark.tags;
      title = title || bookmark.title;
      notes = notes || bookmark.notes;
    }
    bookmark.title = title;
    bookmark.tags = tags;
    bookmark.notes = notes;
    saveBookmarks(bookmarks);
    console.log("Bookmark updated successfully!");
  });

export default editCommand;
