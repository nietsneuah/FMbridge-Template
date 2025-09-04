#!/usr/bin/env node
/**
 * FileMaker Template Upload Script
 * 
 * This script uploads the built template to FileMaker by opening a FileMaker URL
 * that triggers a script to import the template into the database.
 * 
 * Usage: node upload.js
 */
import config from "../src/widget.config.js";
const { widgetName, uploadScript, file, server } = config;
console.log(`Uploading ${widgetName} to FileMaker...`);
console.log(`Server: ${server}`);
console.log(`File: ${file}`);
console.log(`Script: ${uploadScript}`);
import open from "open";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const isRemoteServer = server.startsWith('http://') || server.startsWith('https://');
let fileUrl;
if (isRemoteServer) {
  const serverWithoutProtocol = server.replace(/^https?:\/\//, '');
  console.log(`Remote server detected. Using server without protocol: ${serverWithoutProtocol}`);
  fileUrl = `fmp://${serverWithoutProtocol}/${file}?script=${uploadScript}&param=`;
} else {
  fileUrl = `fmp://${server}/${file}?script=${uploadScript}&param=`;
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const thePath = path.join(__dirname, "../", "dist/filemaker", "index.html");
if (!fs.existsSync(thePath)) {
  console.error(`Error: FileMaker build not found at ${thePath}`);
  console.error('Make sure to run "npm run build:filemaker" before uploading');
  process.exit(1);
}
const params = { 
  widgetName, 
  thePath,
  timestamp: new Date().toISOString()
};
const encodedParams = encodeURIComponent(JSON.stringify(params));
const url = fileUrl + encodedParams;
console.log('--- Detailed URL Information ---');
console.log(`Base URL: ${fileUrl}`);
console.log(`Parameters: ${JSON.stringify(params, null, 2)}`);
console.log(`Encoded Parameters: ${encodedParams}`);
console.log(`Full URL: ${url}`);
console.log('-------------------------------');
console.log(`Opening URL: ${fileUrl}`);
open(url);
