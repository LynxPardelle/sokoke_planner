import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AsyncErrorHandler } from './app/shared/utils/async-error-handler.util';
import { ChromeExtensionErrorSuppressor } from './app/shared/utils/chrome-extension-suppressor.util';

// Initialize Chrome extension error suppressor first (most aggressive)
ChromeExtensionErrorSuppressor.getInstance();

// Initialize async error handler to prevent Chrome extension interference
AsyncErrorHandler.getInstance();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
