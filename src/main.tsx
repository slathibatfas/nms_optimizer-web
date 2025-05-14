import { Theme } from "@radix-ui/themes";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Main App CSS
import './index.css';
import './theme.css';

import ErrorBoundary from './components/ErrorBoundry/ErrorBoundry'; // Import your ErrorBoundary
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary> {/* Wrap App with ErrorBoundary */}
        <Theme appearance="dark" accentColor="blue" className="!bg-transparent">
          <App />
        </Theme>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
