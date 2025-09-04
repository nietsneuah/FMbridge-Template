import './style.css'
import { fileMakerBridge } from './filemakerBridge'
import { fileUploader } from './upload.js'
import widgetConfig from './widget.config.js'

// Initialize FileMaker widget
class FileMakerWidget {
  private initialized = false;

  constructor() {
    this.init();
  }

  async init() {
    try {
      // Log widget startup
      fileMakerBridge.log(`Initializing ${widgetConfig.name} v${widgetConfig.version}`, 'info');
      
      // Set up the UI
      this.setupUI();
      
      // Initialize FileMaker communication
      await this.initializeFileMaker();
      
      // Set up event listeners
      this.setupEventListeners();
      
      this.initialized = true;
      fileMakerBridge.log('Widget initialized successfully', 'info');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      fileMakerBridge.log(`Failed to initialize widget: ${errorMessage}`, 'error');
      this.showError('Failed to initialize application');
    }
  }

  private setupUI() {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    
    app.innerHTML = `
      <div class="fm-card max-w-4xl mx-auto">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">${widgetConfig.name}</h1>
          <p class="text-gray-600">FileMaker WebViewer Template - Ready for customization</p>
        </div>
        
        <!-- Demo Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          <!-- FileMaker Communication -->
          <div class="fm-card">
            <h3 class="text-lg font-semibold mb-4">FileMaker Communication</h3>
            <div class="space-y-3">
              <button id="test-connection" class="fm-button fm-button-primary w-full">
                Test Connection
              </button>
              <button id="call-script" class="fm-button fm-button-secondary w-full">
                Call Test Script
              </button>
              <div id="connection-status" class="text-sm text-gray-600"></div>
            </div>
          </div>
          
          <!-- File Upload -->
          <div class="fm-card">
            <h3 class="text-lg font-semibold mb-4">File Upload</h3>
            <div id="upload-zone" class="upload-zone cursor-pointer">
              <div class="space-y-2">
                <svg class="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p class="text-sm text-gray-600">Click or drag files here to upload</p>
              </div>
            </div>
            <input type="file" id="file-input" class="hidden" multiple>
          </div>
          
        </div>
        
        <!-- Data Management -->
        <div class="fm-card">
          <h3 class="text-lg font-semibold mb-4">Data Management</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sample Field</label>
              <input type="text" id="sample-field" class="fm-input" placeholder="Enter some data">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select id="category-select" class="fm-select">
                <option value="">Select category...</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
                <option value="category3">Category 3</option>
              </select>
            </div>
            <div class="flex items-end">
              <button id="save-data" class="fm-button fm-button-primary w-full">
                Save to FileMaker
              </button>
            </div>
          </div>
        </div>
        
        <!-- Status and Logs -->
        <div class="fm-card">
          <h3 class="text-lg font-semibold mb-4">Status & Logs</h3>
          <div id="status-log" class="bg-gray-50 rounded p-3 h-32 overflow-y-auto text-sm font-mono">
            <div class="text-gray-600">Ready - Click buttons above to test functionality</div>
          </div>
        </div>
        
      </div>
      
      <!-- Notifications will appear here -->
      <div id="notifications" class="fixed top-4 right-4 space-y-2 z-50"></div>
    `;
  }

  private async initializeFileMaker() {
    try {
      // Call initialize script if available
      if (widgetConfig.fileMaker.scripts.initialize) {
        const result = await fileMakerBridge.callFMScript(
          widgetConfig.fileMaker.scripts.initialize,
          JSON.stringify({ widgetName: widgetConfig.name, version: widgetConfig.version })
        );
        this.logStatus('FileMaker initialization completed', 'success');
        return result;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logStatus(`FileMaker initialization failed: ${errorMessage}`, 'error');
      throw error;
    }
  }

  private setupEventListeners() {
    // Test connection button
    document.getElementById('test-connection')?.addEventListener('click', async () => {
      this.logStatus('Testing FileMaker connection...', 'info');
      try {
        await fileMakerBridge.callFMScript('Test Connection');
        this.logStatus('Connection test successful', 'success');
        this.showNotification('FileMaker connection is working!', 'success');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logStatus(`Connection test failed: ${errorMessage}`, 'error');
        this.showNotification('Connection test failed', 'error');
      }
    });

    // Call script button
    document.getElementById('call-script')?.addEventListener('click', async () => {
      this.logStatus('Calling test script...', 'info');
      try {
        const result = await fileMakerBridge.callFMScript('Test Web Script', 'Hello from web!');
        this.logStatus(`Script result: ${JSON.stringify(result)}`, 'success');
        this.showNotification('Script executed successfully', 'success');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logStatus(`Script execution failed: ${errorMessage}`, 'error');
        this.showNotification('Script execution failed', 'error');
      }
    });

    // Upload zone
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    
    uploadZone?.addEventListener('click', () => fileInput?.click());
    
    fileInput?.addEventListener('change', async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files?.length) {
        await this.handleFileUpload(files);
      }
    });

    // Save data button
    document.getElementById('save-data')?.addEventListener('click', async () => {
      await this.saveData();
    });

    // Auto-save functionality
    if (widgetConfig.data.autoSave) {
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('change', () => {
          this.scheduleAutoSave();
        });
      });
    }
  }

  private async handleFileUpload(files: FileList) {
    this.logStatus(`Uploading ${files.length} file(s)...`, 'info');
    
    try {
      const results = await fileUploader.uploadFiles(files, {
        onFileComplete: (file: any, result: any, error: any) => {
          if (error) {
            this.logStatus(`Upload failed: ${file.name} - ${error.message}`, 'error');
          } else {
            this.logStatus(`Upload successful: ${file.name}`, 'success');
          }
        }
      });
      
      const successful = results.filter(r => r.success).length;
      this.showNotification(`${successful}/${files.length} files uploaded successfully`, 'success');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logStatus(`Bulk upload failed: ${errorMessage}`, 'error');
      this.showNotification('Upload failed', 'error');
    }
  }

  private async saveData() {
    this.logStatus('Saving data to FileMaker...', 'info');
    
    try {
      const sampleField = (document.getElementById('sample-field') as HTMLInputElement)?.value;
      const category = (document.getElementById('category-select') as HTMLSelectElement)?.value;
      
      const data = {
        sampleField,
        category,
        timestamp: new Date().toISOString()
      };
      
      const result = await fileMakerBridge.setFMData(widgetConfig.fileMaker.layouts.data, data);
      this.logStatus('Data saved successfully', 'success');
      this.showNotification('Data saved to FileMaker', 'success');
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logStatus(`Save failed: ${errorMessage}`, 'error');
      this.showNotification('Failed to save data', 'error');
      throw error;
    }
  }

  private scheduleAutoSave() {
    // Debounced auto-save implementation
    clearTimeout((this as any).autoSaveTimeout);
    (this as any).autoSaveTimeout = setTimeout(() => {
      this.saveData().catch(() => {
        // Auto-save failure is logged but not shown to user
      });
    }, widgetConfig.data.autoSaveInterval);
  }

  private logStatus(message: string, level: 'info' | 'success' | 'error' = 'info') {
    const statusLog = document.getElementById('status-log');
    if (statusLog) {
      const timestamp = new Date().toLocaleTimeString();
      const className = level === 'error' ? 'text-red-600' : level === 'success' ? 'text-green-600' : 'text-gray-600';
      
      const logEntry = document.createElement('div');
      logEntry.className = className;
      logEntry.textContent = `[${timestamp}] ${message}`;
      
      statusLog.appendChild(logEntry);
      statusLog.scrollTop = statusLog.scrollHeight;
    }
    
    // Also log to FileMaker bridge
    fileMakerBridge.log(message, level === 'success' ? 'info' : level);
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    const notifications = document.getElementById('notifications');
    if (!notifications) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <span>${message}</span>
        <button class="ml-2 text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
    
    notifications.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  private showError(message: string) {
    const app = document.querySelector('#app');
    if (app) {
      app.innerHTML = `
        <div class="fm-card max-w-md mx-auto text-center">
          <div class="text-red-500 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold mb-2">Error</h2>
          <p class="text-gray-600 mb-4">${message}</p>
          <button onclick="location.reload()" class="fm-button fm-button-primary">
            Retry
          </button>
        </div>
      `;
    }
  }
}

// Initialize the widget when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new FileMakerWidget();
});

// Export for global access
(window as any).FileMakerWidget = FileMakerWidget;
