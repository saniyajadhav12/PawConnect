// Experimental browser APIs used by the demo pages that TypeScript's DOM lib does not include yet.
// (Web Bluetooth types come from @types/web-bluetooth.)

// Network Information API, including vendor-prefixed versions (NetworkStatusHandler).
// navigator.connection itself is already declared by react-router as { saveData: boolean }.
interface Navigator {
  readonly mozConnection?: NetworkInformation;
  readonly webkitConnection?: NetworkInformation;
}

interface NetworkInformation {
  readonly effectiveType?: string;
  readonly saveData?: boolean;
}

// File System Access API save dialog (GeolocationHandler)
interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string | string[]>;
}

interface FilePickerOptions {
  suggestedName?: string;
  types?: FilePickerAcceptType[];
  excludeAcceptAllOption?: boolean;
}

interface Window {
  showSaveFilePicker(options?: FilePickerOptions): Promise<FileSystemFileHandle>;
}
