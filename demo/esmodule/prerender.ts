import fs from "node:fs";
import path from "node:path";
import { render } from "./dist/index.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const toAbsolute = (p: string) => path.resolve(__dirname, p);
const template = fs.readFileSync(toAbsolute("./index.html"), "utf-8");

const appHtml = render();
const html = template.replace(`<!--app-html-->`, appHtml);

const filePath = `output/index.html`;
fs.writeFileSync(toAbsolute(filePath), html);
