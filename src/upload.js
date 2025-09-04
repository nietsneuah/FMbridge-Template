#!/usr/bin/env node

/**
 * FileMaker Template Upload Script
 * 
 * This script uploads the built template to FileMaker by opening a FileMaker URL
 * that triggers a script to import the template into the database.
 * 
 * Usage: node upload.js
 */

// Import configuration from widget.config.js
import config from "./widget.config.js";

// Extract configuration values
const { name: widgetName, fileMaker } = config;
const { 
  uploadScript = 'Import Web Widget',
  file = 'WebWidgets.fmp12',
  server = 'localhost'
} = fileMaker;

// Log configuration for debugging
console.log(`Uploading ${widgetName} to FileMaker...`);
console.log(`Server: ${server}`);
console.log(`File: ${file}`);
console.log(`Script: ${uploadScript}`);

// Required modules
import open from "open";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Construct FileMaker URL
// Format: fmp://server/file?script=scriptName&param=parameters
// Check if server URL includes protocol (http:// or https://)
const isRemoteServer = server.startsWith('http://') || server.startsWith('https://');
let fileUrl;

if (isRemoteServer) {
  // For remote servers, remove the protocol from the server URL
  const serverWithoutProtocol = server.replace(/^https?:\/\//, '');
  console.log(`Remote server detected. Using server without protocol: ${serverWithoutProtocol}`);
  fileUrl = `fmp://${serverWithoutProtocol}/${file}?script=${uploadScript}&param=`;
} else {
  // For local servers, use the standard FileMaker protocol
  fileUrl = `fmp://${server}/${file}?script=${uploadScript}&param=`;
}

// Path to the built index.html file
// In ES modules, __dirname is not available, so we need to construct it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const thePath = path.join(__dirname, "../", "dist/index.html");

// Check if the build exists
if (!fs.existsSync(thePath)) {
  console.error(`Error: Build not found at ${thePath}`);
  console.error('Make sure to run "npm run build" before uploading');
  process.exit(1);
}

// Parameters to pass to FileMaker script
const params = { 
  widgetName, 
  thePath,
  timestamp: new Date().toISOString(),
  version: config.version
};

// Construct the full URL with encoded parameters
const encodedParams = encodeURIComponent(JSON.stringify(params));
const url = fileUrl + encodedParams;

// Log detailed information for debugging
console.log('--- Detailed URL Information ---');
console.log(`Base URL: ${fileUrl}`);
console.log(`Parameters: ${JSON.stringify(params, null, 2)}`);
console.log(`Encoded Parameters: ${encodedParams}`);
console.log(`Full URL: ${url}`);
console.log('-------------------------------');

// Log the URL (without encoded parameters for readability)
console.log(`Opening URL: ${fileUrl}`);

// Open the URL, which will launch FileMaker and trigger the script
open(url);
