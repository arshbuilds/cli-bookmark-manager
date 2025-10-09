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

 function saveBookmarks(bookmarks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookmarks, null, 2), "utf8");
}

const deleteCommand = new Command("delete").description("Delete an item from the list").argument("<id>", "ID of the item to delete").action((id) => {
    console.log(`Deleting item with ID: ${id}`);
    let bookmarks = loadBookMarks();
    const originalLength = bookmarks.length;
    bookmarks = bookmarks.filter((b) => b.id !== parseInt(id));

    if(bookmarks.length === originalLength){
        console.log(`No bookmark found with ID: ${id}`);
    }else{
        saveBookmarks(bookmarks);
        console.log("Item deleted successfully!");
    }
});

export default deleteCommand;