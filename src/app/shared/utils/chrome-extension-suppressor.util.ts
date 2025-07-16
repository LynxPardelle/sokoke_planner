/**
 * Chrome Extension Error Suppressor
 * 
 * This utility specifically targets and suppresses common Chrome extension
 * errors that interfere with Angular applications
 */
export class ChromeExtensionErrorSuppressor {
  private static instance: ChromeExtensionErrorSuppressor;
  private originalMethods: Map<string, any> = new Map();

  private constructor() {
    this.initialize();
  }

  static getInstance(): ChromeExtensionErrorSuppressor {
    if (!ChromeExtensionErrorSuppressor.instance) {
      ChromeExtensionErrorSuppressor.instance = new ChromeExtensionErrorSuppressor();
    }
    return ChromeExtensionErrorSuppressor.instance;
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Suppress console errors from Chrome extensions
    this.interceptConsole();
    
    // Block Chrome extension runtime errors
    this.blockChromeRuntimeErrors();
    
    // Handle DOM modification errors from extensions
    this.handleDOMModificationErrors();
    
    // Setup early error prevention
    this.setupEarlyErrorPrevention();
  }

  private interceptConsole(): void {
    // Store original methods
    this.originalMethods.set('console.error', console.error);
    this.originalMethods.set('console.warn', console.warn);

    // Override console.error
    console.error = (...args: any[]) => {
      const message = args.join(' ').toLowerCase();
      
      if (this.isChromeExtensionMessage(message)) {
        // Log to a different method to avoid spam
        console.debug('Chrome extension error suppressed:', ...args);
        return;
      }
      
      // Call original method for legitimate errors
      this.originalMethods.get('console.error').apply(console, args);
    };

    // Override console.warn for runtime.lastError
    console.warn = (...args: any[]) => {
      const message = args.join(' ').toLowerCase();
      
      if (this.isChromeExtensionMessage(message)) {
        console.debug('Chrome extension warning suppressed:', ...args);
        return;
      }
      
      this.originalMethods.get('console.warn').apply(console, args);
    };
  }

  private isChromeExtensionMessage(message: string): boolean {
    const patterns = [
      'unchecked runtime.lasterror',
      'runtime.lasterror',
      'message port closed before a response was received',
      'the message port closed before a response was received',
      'chrome-extension',
      'moz-extension',
      'extension context invalidated',
      'could not establish connection',
      'message channel closed',
      'port closed before response',
      'listener indicated an asynchronous response'
    ];

    return patterns.some(pattern => message.includes(pattern));
  }

  private blockChromeRuntimeErrors(): void {
    // Intercept Chrome runtime API calls
    const interceptChrome = () => {
      const chromeGlobal = (window as any).chrome;
      if (!chromeGlobal || !chromeGlobal.runtime) return;

      // Override sendMessage to prevent errors
      if (chromeGlobal.runtime.sendMessage) {
        const originalSendMessage = chromeGlobal.runtime.sendMessage;
        chromeGlobal.runtime.sendMessage = (...args: any[]) => {
          try {
            const result = originalSendMessage.apply(chromeGlobal.runtime, args);
            
            // Handle promise rejection
            if (result && typeof result.catch === 'function') {
              result.catch((error: any) => {
                console.debug('Chrome extension sendMessage error suppressed:', error);
              });
            }
            
            return result;
          } catch (error) {
            console.debug('Chrome extension sendMessage sync error suppressed:', error);
            return Promise.resolve();
          }
        };
      }

      // Override connect to prevent connection errors
      if (chromeGlobal.runtime.connect) {
        const originalConnect = chromeGlobal.runtime.connect;
        chromeGlobal.runtime.connect = (...args: any[]) => {
          try {
            const port = originalConnect.apply(chromeGlobal.runtime, args);
            
            // Suppress port errors
            if (port && port.onDisconnect) {
              port.onDisconnect.addListener(() => {
                // Suppress disconnect errors
                if (chromeGlobal.runtime.lastError) {
                  console.debug('Chrome extension port disconnect error suppressed:', chromeGlobal.runtime.lastError);
                }
              });
            }
            
            return port;
          } catch (error) {
            console.debug('Chrome extension connect error suppressed:', error);
            return null;
          }
        };
      }
    };

    // Try to intercept immediately and also after a delay
    interceptChrome();
    setTimeout(interceptChrome, 100);
    setTimeout(interceptChrome, 500);
  }

  private handleDOMModificationErrors(): void {
    // Override MutationObserver to catch extension DOM modifications
    if (typeof window.MutationObserver !== 'undefined') {
      const OriginalMutationObserver = window.MutationObserver;
      
      window.MutationObserver = class extends OriginalMutationObserver {
        constructor(callback: MutationCallback) {
          const wrappedCallback: MutationCallback = (mutations, observer) => {
            try {
              callback(mutations, observer);
            } catch (error: any) {
              const errorMessage = error?.message || error?.toString() || '';
              if (ChromeExtensionErrorSuppressor.getInstance().isChromeExtensionMessage(errorMessage.toLowerCase())) {
                console.debug('Chrome extension MutationObserver error suppressed:', error);
              } else {
                throw error; // Re-throw non-extension errors
              }
            }
          };
          
          super(wrappedCallback);
        }
      };
    }
  }

  private setupEarlyErrorPrevention(): void {
    // Prevent errors during document ready
    document.addEventListener('DOMContentLoaded', () => {
      this.blockChromeRuntimeErrors();
    });

    // Handle window load
    window.addEventListener('load', () => {
      this.blockChromeRuntimeErrors();
    });

    // Handle beforeunload to clean up
    window.addEventListener('beforeunload', () => {
      this.restoreOriginalMethods();
    });
  }

  private restoreOriginalMethods(): void {
    // Restore original console methods if needed
    if (this.originalMethods.has('console.error')) {
      console.error = this.originalMethods.get('console.error');
    }
    if (this.originalMethods.has('console.warn')) {
      console.warn = this.originalMethods.get('console.warn');
    }
  }

  /**
   * Force suppress a specific error pattern
   */
  suppressErrorPattern(pattern: string): void {
    const currentErrorHandler = window.onerror;
    
    window.onerror = (message, source, lineno, colno, error) => {
      if (typeof message === 'string' && message.toLowerCase().includes(pattern.toLowerCase())) {
        console.debug('Custom error pattern suppressed:', message);
        return true; // Prevent default error handling
      }
      
      // Call original handler for other errors
      if (currentErrorHandler) {
        return currentErrorHandler(message, source, lineno, colno, error);
      }
      
      return false;
    };
  }
}

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  ChromeExtensionErrorSuppressor.getInstance();
  
  // Specifically suppress the runtime.lastError pattern
  ChromeExtensionErrorSuppressor.getInstance().suppressErrorPattern('runtime.lastError');
  ChromeExtensionErrorSuppressor.getInstance().suppressErrorPattern('message port closed');
}
