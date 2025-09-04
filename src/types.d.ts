declare module './upload.js' {
  export class FileUploader {
    constructor();
    uploadFile(file: File, options?: any): Promise<any>;
    uploadFiles(files: FileList | File[], options?: any): Promise<any[]>;
    fileToBase64(file: File, onProgress?: (progress: number) => void): Promise<string>;
    setupDragAndDrop(dropZone?: HTMLElement): void;
    handleDroppedFiles(files: FileList): Promise<void>;
    formatFileSize(bytes: number): string;
    createFileInput(options?: any): HTMLInputElement;
  }
  
  export const fileUploader: FileUploader;
}

declare module './widget.config.js' {
  interface WidgetConfig {
    name: string;
    version: string;
    description: string;
    fileMaker: {
      scripts: Record<string, string>;
      layouts: Record<string, string>;
      timeoutMs: number;
      retryAttempts: number;
      enableLogging: boolean;
    };
    ui: any;
    upload: any;
    data: {
      autoSave: boolean;
      autoSaveInterval: number;
      validateOnSave: boolean;
      cacheEnabled: boolean;
      cacheExpiry: number;
    };
    development: any;
    security: any;
    features: any;
    localization: any;
    performance: any;
  }
  
  const widgetConfig: WidgetConfig;
  export default widgetConfig;
  
  export function validateConfig(config?: WidgetConfig): { isValid: boolean; errors: string[] };
  export function mergeConfig(baseConfig: WidgetConfig, userConfig: Partial<WidgetConfig>): WidgetConfig;
}
