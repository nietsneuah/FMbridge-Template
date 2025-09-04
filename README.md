# FMbridge Template

A comprehensive template for creating FileMaker webviewer applications using Vite, TypeScript, and Tailwind CSS.

## Overview

This template provides a solid foundation for building modern web applications that run inside FileMaker Pro's webviewer. It includes communication bridges, file upload capabilities, and a responsive UI framework optimized for FileMaker integration.

## Features

- **TypeScript Support**: Full TypeScript integration for type-safe development
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **FileMaker Bridge**: Comprehensive communication interface with FileMaker Pro
- **File Upload**: Drag-and-drop file upload with FileMaker integration
- **Responsive Design**: Mobile-friendly layouts optimized for FileMaker webviewers
- **Development Tools**: Hot reload, build optimization, and debugging support
- **Configuration Management**: Centralized widget configuration system

## Project Structure

```
FMbridge-Template/
├── src/
│   ├── filemakerBridge.ts    # FileMaker communication interface
│   ├── upload.js             # File upload utilities
│   ├── widget.config.js      # Widget configuration
│   ├── main.ts              # Main application entry point
│   ├── style.css            # Tailwind CSS and custom styles
│   └── types.d.ts           # TypeScript type declarations
├── public/                   # Static assets
├── dist/                    # Built files for FileMaker deployment
├── .github/
│   └── copilot-instructions.md  # Development guidelines
├── vite.config.js           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+ (required for development server)
- FileMaker Pro 16+ (for webviewer integration)

### Installation

1. Clone this template:
   ```bash
   git clone <repository-url> my-filemaker-app
   cd my-filemaker-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

### FileMaker Integration

1. Build the project using `npm run build`
2. Copy the contents of the `dist/` folder to your FileMaker solution
3. Create a webviewer in FileMaker and point it to `index.html`
4. Implement the required FileMaker scripts (see Configuration section)

## Configuration

### Widget Configuration

Edit `src/widget.config.js` to customize your application:

```javascript
export const widgetConfig = {
  name: 'Your App Name',
  version: '1.0.0',
  fileMaker: {
    scripts: {
      initialize: 'Initialize Web Widget',
      getData: 'Get Web Data',
      setData: 'Set Web Data',
      // ... other script names
    },
    layouts: {
      main: 'Web_Main',
      data: 'Web_Data',
      // ... other layout names
    }
  },
  // ... other configuration options
};
```

### Required FileMaker Scripts

Implement these scripts in your FileMaker solution:

1. **Initialize Web Widget**: Called when the widget starts
2. **Get Web Data**: Retrieves data from FileMaker
3. **Set Web Data**: Saves data to FileMaker
4. **Upload Web File**: Handles file uploads
5. **Log Web Message**: Logs messages from the web app
6. **Show Web Message**: Displays notifications in FileMaker

### FileMaker Communication Examples

```typescript
import { fileMakerBridge } from './filemakerBridge';

// Call a FileMaker script
const result = await fileMakerBridge.callFMScript('My Script', 'parameter');

// Get data from FileMaker
const data = await fileMakerBridge.getFMData('My_Layout', 'recordId');

// Save data to FileMaker
await fileMakerBridge.setFMData('My_Layout', { field1: 'value1' });

// Log messages
fileMakerBridge.log('Application started', 'info');

// Show notifications
fileMakerBridge.showMessage('Data saved successfully', 'success');
```

## Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally

### Development Guidelines

1. **FileMaker Integration**: Test your application in both browser and FileMaker webviewer
2. **Responsive Design**: Ensure your UI works across different FileMaker layout sizes
3. **Error Handling**: Implement comprehensive error handling for FileMaker communication
4. **Performance**: Keep bundle sizes reasonable for FileMaker webviewer performance

### File Upload Integration

The template includes comprehensive file upload capabilities:

```typescript
import { fileUploader } from './upload.js';

// Upload single file
await fileUploader.uploadFile(file, {
  containerField: 'My_Container',
  layoutName: 'Upload_Layout'
});

// Upload multiple files
await fileUploader.uploadFiles(fileList, {
  concurrent: false,
  onFileComplete: (file, result, error) => {
    // Handle individual file completion
  }
});
```

## Customization

### Styling

The template uses Tailwind CSS for styling. Key classes:

- `.fm-card`: Standard card component
- `.fm-button`, `.fm-button-primary`, `.fm-button-secondary`: Button styles
- `.fm-input`, `.fm-select`: Form input styles
- `.upload-zone`: File upload drop zone

### Adding New Features

1. Create new TypeScript/JavaScript files in `src/`
2. Import and use in `main.ts`
3. Update configuration in `widget.config.js` if needed
4. Add required FileMaker scripts for new functionality

## Deployment

### Building for FileMaker

1. Run `npm run build` to create optimized files
2. Copy all files from `dist/` folder to your FileMaker solution
3. Reference `index.html` in your FileMaker webviewer
4. Test all functionality within FileMaker environment

### Production Considerations

- **File Paths**: All assets use relative paths for FileMaker compatibility
- **Bundle Size**: Optimized for FileMaker webviewer performance
- **Browser Compatibility**: Targets modern browsers supported by FileMaker
- **Security**: Implements CSP-friendly code patterns

## Troubleshooting

### Common Issues

1. **Node.js Version**: Requires Node.js 20.19+ for development server
2. **FileMaker Scripts**: Ensure all required scripts are implemented
3. **Path Issues**: Verify relative paths in FileMaker webviewer
4. **CORS**: FileMaker webviewer has different security restrictions

### Debug Mode

Enable debug mode by setting `NODE_ENV=development` or testing in browser first before deploying to FileMaker.

## Support

For issues and questions:

1. Check the configuration in `widget.config.js`
2. Review FileMaker script implementations
3. Test in browser before deploying to FileMaker
4. Check browser console for JavaScript errors

## License

This template is provided as-is for FileMaker development projects.

---

**Note**: This template is designed specifically for FileMaker webviewer integration. For standalone web applications, consider using standard Vite templates instead.
