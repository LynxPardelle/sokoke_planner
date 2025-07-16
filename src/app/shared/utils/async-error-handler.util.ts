/**
 * Utility to handle async errors and prevent Chrome extension interference
 */
export class AsyncErrorHandler {
  private static instance: AsyncErrorHandler;
  private errorHandlers: Map<string, (error: any) => void> = new Map();

  private constructor() {
    this.setupGlobalErrorHandling();
  }

  static getInstance(): AsyncErrorHandler {
    if (!AsyncErrorHandler.instance) {
      AsyncErrorHandler.instance = new AsyncErrorHandler();
    }
    return AsyncErrorHandler.instance;
  }

  /**
   * Setup global error handling to catch async errors
   */
  private setupGlobalErrorHandling(): void {
    if (typeof window === 'undefined') return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      
      // Check if this is a Chrome extension message channel error
      if (this.isChromeExtensionError(error)) {
        console.warn('Chrome extension message channel error caught and suppressed:', error);
        event.preventDefault(); // Prevent the error from being logged
        return;
      }

      // Handle other unhandled rejections
      this.handleUnhandledRejection(error);
    });

    // Handle general errors
    window.addEventListener('error', (event) => {
      const error = event.error;
      
      if (this.isChromeExtensionError(error)) {
        console.warn('Chrome extension error caught and suppressed:', error);
        event.preventDefault();
        return;
      }

      this.handleGeneralError(error);
    });

    // Handle Chrome runtime.lastError specifically
    this.setupChromeRuntimeErrorSuppression();
  }

  /**
   * Setup Chrome runtime.lastError suppression
   */
  private setupChromeRuntimeErrorSuppression(): void {
    // Override console.error to filter out Chrome extension errors
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(' ').toLowerCase();
      
      // Check if this is a Chrome extension runtime error
      if (this.isChromeExtensionRuntimeError(message)) {
        console.warn('Chrome extension runtime error suppressed:', ...args);
        return;
      }
      
      // Call original console.error for non-extension errors
      originalConsoleError.apply(console, args);
    };

    // Also handle console.warn for runtime.lastError
    const originalConsoleWarn = console.warn;
    console.warn = (...args: any[]) => {
      const message = args.join(' ').toLowerCase();
      
      if (this.isChromeExtensionRuntimeError(message)) {
        // Still log but with a different prefix to avoid confusion
        console.log('Chrome extension warning (suppressed):', ...args);
        return;
      }
      
      originalConsoleWarn.apply(console, args);
    };
  }

  /**
   * Check if this is a Chrome runtime error
   */
  private isChromeExtensionRuntimeError(message: string): boolean {
    const runtimeErrorPatterns = [
      'unchecked runtime.lasterror',
      'runtime.lasterror',
      'message port closed before a response was received',
      'the message port closed before a response was received',
      'chrome-extension',
      'moz-extension'
    ];

    return runtimeErrorPatterns.some(pattern => 
      message.includes(pattern)
    );
  }

  /**
   * Check if the error is related to Chrome extension message channels
   */
  private isChromeExtensionError(error: any): boolean {
    if (!error) return false;

    const errorMessage = error.message || error.toString() || '';
    
    // Common Chrome extension error patterns
    const chromeExtensionPatterns = [
      'A listener indicated an asynchronous response by returning true',
      'message channel closed before a response was received',
      'The message port closed before a response was received',
      'runtime.lastError',
      'Extension context invalidated',
      'Could not establish connection',
      'chrome-extension://',
      'moz-extension://',
      'message port closed',
      'port closed before response',
      'unchecked runtime.lasterror'
    ];

    return chromeExtensionPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Handle unhandled promise rejections
   */
  private handleUnhandledRejection(error: any): void {
    console.error('Unhandled promise rejection:', error);
    
    // Notify registered handlers
    this.errorHandlers.forEach(handler => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error in async error handler:', handlerError);
      }
    });
  }

  /**
   * Handle general errors
   */
  private handleGeneralError(error: any): void {
    console.error('General error:', error);
  }

  /**
   * Register an error handler
   */
  registerErrorHandler(id: string, handler: (error: any) => void): void {
    this.errorHandlers.set(id, handler);
  }

  /**
   * Unregister an error handler
   */
  unregisterErrorHandler(id: string): void {
    this.errorHandlers.delete(id);
  }

  /**
   * Wrap async operations to handle errors gracefully
   */
  static wrapAsync<T>(operation: () => Promise<T>, fallback?: T): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        operation()
          .then(resolve)
          .catch(error => {
            const handler = AsyncErrorHandler.getInstance();
            
            if (handler.isChromeExtensionError(error)) {
              console.warn('Chrome extension error in async operation, using fallback:', error);
              if (fallback !== undefined) {
                resolve(fallback);
              } else {
                reject(new Error('Chrome extension interference detected'));
              }
            } else {
              reject(error);
            }
          });
      } catch (error) {
        const handler = AsyncErrorHandler.getInstance();
        
        if (handler.isChromeExtensionError(error)) {
          console.warn('Chrome extension error in sync operation, using fallback:', error);
          if (fallback !== undefined) {
            resolve(fallback);
          } else {
            reject(new Error('Chrome extension interference detected'));
          }
        } else {
          reject(error);
        }
      }
    });
  }

  /**
   * Safe timeout wrapper that cleans up properly
   */
  static safeTimeout(callback: () => void, delay: number): () => void {
    let timeoutId: number | undefined;
    let cancelled = false;

    timeoutId = window.setTimeout(() => {
      if (!cancelled) {
        try {
          callback();
        } catch (error) {
          const handler = AsyncErrorHandler.getInstance();
          if (!handler.isChromeExtensionError(error)) {
            console.error('Error in safe timeout:', error);
          }
        }
      }
      timeoutId = undefined;
    }, delay);

    // Return cleanup function
    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };
  }

  /**
   * Safe interval wrapper that cleans up properly
   */
  static safeInterval(callback: () => void, delay: number): () => void {
    let intervalId: number | undefined;
    let cancelled = false;

    intervalId = window.setInterval(() => {
      if (!cancelled) {
        try {
          callback();
        } catch (error) {
          const handler = AsyncErrorHandler.getInstance();
          if (!handler.isChromeExtensionError(error)) {
            console.error('Error in safe interval:', error);
          }
        }
      }
    }, delay);

    // Return cleanup function
    return () => {
      cancelled = true;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    };
  }
}

// Initialize the error handler when the module is loaded
if (typeof window !== 'undefined') {
  AsyncErrorHandler.getInstance();
  
  // Additional Chrome extension interference prevention
  setTimeout(() => {
    // Suppress Chrome extension runtime errors at the global level
    const chromeGlobal = (window as any).chrome;
    if (typeof chromeGlobal !== 'undefined' && chromeGlobal.runtime) {
      const originalSendMessage = chromeGlobal.runtime.sendMessage;
      if (originalSendMessage) {
        chromeGlobal.runtime.sendMessage = function(...args: any[]) {
          try {
            return originalSendMessage.apply(this, args);
          } catch (error) {
            console.warn('Chrome extension sendMessage error suppressed:', error);
            return Promise.resolve();
          }
        };
      }
    }
  }, 0);
}
