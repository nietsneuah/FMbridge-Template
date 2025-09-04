/**
 * FileMaker Bridge
 * Provides communication interface between the web app and FileMaker Pro
 */

export interface FileMakerBridge {
  // Core communication methods
  callFMScript(scriptName: string, parameter?: string): Promise<any>;
  getFMData(layoutName: string, recordId?: string): Promise<any>;
  setFMData(layoutName: string, data: Record<string, any>): Promise<any>;
  
  // Utility methods
  log(message: string, level?: 'info' | 'warn' | 'error'): void;
  showMessage(message: string, type?: 'success' | 'error' | 'warning'): void;
  
  // Event handlers
  onFMScriptResult?: (result: any) => void;
  onFMError?: (error: any) => void;
}

declare global {
  interface Window {
    FileMaker?: {
      PerformScript: (scriptName: string, parameter?: string) => void;
      PerformScriptWithOption: (scriptName: string, parameter?: string, option?: number) => void;
    };
    webkit?: {
      messageHandlers?: {
        FileMakerHandler?: {
          postMessage: (message: any) => void;
        };
      };
    };
  }
}

class FileMakerBridgeImpl implements FileMakerBridge {
  private pendingCallbacks: Map<string, (result: any) => void> = new Map();
  
  constructor() {
    this.initializeMessageListener();
  }

  private initializeMessageListener(): void {
    // Listen for messages from FileMaker
    window.addEventListener('message', (event) => {
      if (event.data?.source === 'filemaker') {
        this.handleFileMakerMessage(event.data);
      }
    });
  }

  private handleFileMakerMessage(data: any): void {
    const { callbackId, result, error } = data;
    
    if (error && this.onFMError) {
      this.onFMError(error);
      return;
    }

    if (callbackId && this.pendingCallbacks.has(callbackId)) {
      const callback = this.pendingCallbacks.get(callbackId);
      if (callback) {
        callback(result);
        this.pendingCallbacks.delete(callbackId);
      }
    }

    if (this.onFMScriptResult) {
      this.onFMScriptResult(result);
    }
  }

  async callFMScript(scriptName: string, parameter?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const callbackId = `callback_${Date.now()}_${Math.random()}`;
        this.pendingCallbacks.set(callbackId, resolve);

        const message = {
          action: 'callScript',
          scriptName,
          parameter,
          callbackId
        };

        // Try different communication methods based on FileMaker environment
        if (window.webkit?.messageHandlers?.FileMakerHandler) {
          // Modern FileMaker WebViewer
          window.webkit.messageHandlers.FileMakerHandler.postMessage(message);
        } else if (window.FileMaker?.PerformScript) {
          // Legacy FileMaker WebViewer
          window.FileMaker.PerformScript(scriptName, parameter);
        } else {
          // Development mode - simulate FileMaker response
          console.log('FileMaker Bridge (Dev Mode):', message);
          setTimeout(() => resolve({ success: true, data: null }), 100);
        }

        // Timeout after 30 seconds
        setTimeout(() => {
          if (this.pendingCallbacks.has(callbackId)) {
            this.pendingCallbacks.delete(callbackId);
            reject(new Error('FileMaker script call timeout'));
          }
        }, 30000);

      } catch (error) {
        reject(error);
      }
    });
  }

  async getFMData(layoutName: string, recordId?: string): Promise<any> {
    const parameter = JSON.stringify({ layoutName, recordId });
    return this.callFMScript('Get Web Data', parameter);
  }

  async setFMData(layoutName: string, data: Record<string, any>): Promise<any> {
    const parameter = JSON.stringify({ layoutName, data });
    return this.callFMScript('Set Web Data', parameter);
  }

  log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    console[level](logMessage);
    
    // Send log to FileMaker if available
    this.callFMScript('Log Web Message', JSON.stringify({
      message: logMessage,
      level,
      timestamp
    })).catch(() => {
      // Ignore errors when logging to FileMaker
    });
  }

  showMessage(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    this.callFMScript('Show Web Message', JSON.stringify({
      message,
      type
    })).catch(() => {
      // Fallback to browser alert if FileMaker is not available
      alert(message);
    });
  }

  // Event handler properties
  onFMScriptResult?: (result: any) => void;
  onFMError?: (error: any) => void;
}

// Create and export singleton instance
export const fileMakerBridge = new FileMakerBridgeImpl();

// Make it globally available for debugging
(window as any).fileMakerBridge = fileMakerBridge;
