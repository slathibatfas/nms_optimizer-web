import { Theme } from "@radix-ui/themes";
import { StrictMode, Suspense } from "react"; // Added Suspense
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Main App CSS
import "./index.css";

// i18n
import "./i18n"; // Initialize i18next

import ErrorBoundary from "./components/ErrorBoundry/ErrorBoundry";
import MessageSpinner from "./components/MessageSpinner/MessageSpinner"; // For Suspense fallback
import App from "./App";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<ErrorBoundary>
				<Theme appearance="dark" accentColor="cyan" className="!bg-transparent">
					<Suspense
						fallback={
							<main className="flex flex-col items-center justify-center lg:min-h-screen">
								<MessageSpinner
									isVisible={true}
									isInset={true}
									initialMessage="Activating Uplink..."
								/>
							</main>
						}
					>
						<App />
					</Suspense>
				</Theme>
			</ErrorBoundary>
		</BrowserRouter>
	</StrictMode>
);
