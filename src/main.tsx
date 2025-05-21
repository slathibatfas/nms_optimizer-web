import { Theme } from "@radix-ui/themes";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Main App CSS
import './index.css';

import ErrorBoundary from './components/ErrorBoundry/ErrorBoundry';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Theme appearance="dark" accentColor="cyan" className="!bg-transparent">
          <App />
        </Theme>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
