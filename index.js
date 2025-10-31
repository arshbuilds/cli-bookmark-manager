#!/usr/bin/env node
import { Command } from "commander";
import addCommand from "./commands/add.js";
import searchCommand from "./commands/search.js";
import deleteCommand from "./commands/delete.js";
import editCommand from "./commands/edit.js";
import syncCommand from "./commands/sync.js";
import showCommand from "./commands/show.js";
import openCommand from "./commands/open.js";

const program = new Command();

program
  .name("kbm")
  .description("CLI Bookmark Manager")
  .version("0.1.0");

program.addCommand(addCommand);
program.addCommand(searchCommand);
program.addCommand(deleteCommand);
program.addCommand(editCommand);
program.addCommand(syncCommand);
program.addCommand(showCommand);
program.addCommand(openCommand);
program.parse();