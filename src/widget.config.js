
/**
 * Widget Configuration for FileMaker Dashboard Integration
 * 
 * This file contains configuration settings for the dashboard when used with FileMaker.
 * It includes server information, file paths, and script names for the upload process.
 */

const config = {
  // Widget information
  widget: {
    name: 'FMbridge Template',
    version: '1.0.0',
    description: 'Template for FileMaker webviewer apps',
  },
  
  // FileMaker server information
  filemaker: {
    server: 'localhost', // FileMaker Server address (include protocol for remote servers)
    file: 'WebWidgets.fmp12', // FileMaker database file (case-sensitive)
    uploadScript: 'Import Web Widget', // FileMaker script to handle widget import
    loadScript: 'Load_Widget_Data', // FileMaker script to load data into the widget
  },
  
  // Build configuration
  build: {
    outputDir: 'dist',
    mainFile: 'index.html',
  }
};

// Export configuration using ES module syntax
const exportConfig = {
  widgetName: config.widget.name,
  uploadScript: config.filemaker.uploadScript,
  file: config.filemaker.file,
  server: config.filemaker.server,
  // Include the full config for more advanced usage
  ...config
};

export default exportConfig;
