import { Theme } from "@radix-ui/themes";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Main App CSS
import './index.css';
import './theme.css';

// Component CSS files
// TODO: Need to find a way to import these in the components, but not interfere with Jest. 
import './components/GridCell/GridCell.css';
import './components/GridContainer/GridContainer.css';
import './components/GridShake/GridShake.css';
import './components/GridTable/GridTable.css';
import './components/InfoDialog/InfoDialog.css';
import './components/MessageSpinner/MessageSpinner.css';
import './components/TechTreeRow/TechTreeRow.css';
import './components/TechTree/TechTree.css';
import './components/ShipSelection/ShipSelection.css';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme appearance="dark" accentColor="blue" className="!bg-transparent">
      <App />
    </Theme>
  </StrictMode>,
)
