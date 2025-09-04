<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# FMbridge Template - FileMaker WebViewer Application Template

This workspace contains a comprehensive template for creating FileMaker webviewer applications using Vite, TypeScript, and Tailwind CSS.

## Project Setup Status
- [x] Project initialized with Vite + TypeScript
- [x] Tailwind CSS configured
- [x] FileMaker bridge communication system implemented
- [x] File upload utilities created
- [x] Widget configuration system established
- [x] Build system configured for FileMaker deployment
- [x] Documentation complete

## Key Files
- `src/filemakerBridge.ts` - Communication interface with FileMaker Pro
- `src/upload.js` - File upload utilities with drag-and-drop support
- `src/widget.config.js` - Centralized configuration management
- `src/main.ts` - Main application entry point with demo functionality
- `vite.config.js` - Build configuration optimized for FileMaker
- `README.md` - Comprehensive setup and usage documentation

## Development Requirements
- Node.js 20.19+ for development server (current: 18.16.0)
- FileMaker Pro 16+ for webviewer integration
- Modern browser for testing before FileMaker deployment

## Build Commands
- `npm run dev` - Development server (requires Node.js 20.19+)
- `npm run build` - Production build for FileMaker deployment
- `npm run preview` - Preview production build

## FileMaker Integration
1. Build the project with `npm run build`
2. Copy `dist/` contents to FileMaker solution
3. Point FileMaker webviewer to `index.html`
4. Implement required FileMaker scripts as documented in README.md

This template provides a solid foundation for building modern, responsive web applications that integrate seamlessly with FileMaker Pro's webviewer component.
