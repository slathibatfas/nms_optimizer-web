// src/components/AppHeader/AppHeader.tsx
import React from "react";
import NMSIcon from "../../assets/img/nms_icon.webp";
import NMSShip from "../../assets/img/ship.webp";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { APP_VERSION } from "../../constants";
import ReactGA from "react-ga4";

interface AppHeaderInternalProps {
  onShowChangelog: () => void;
}

const AppHeaderInternal: React.FC<AppHeaderInternalProps> = ({ onShowChangelog }) => {
  return (
    <header className="flex flex-col pt-3 pb-1 pl-6 sm:pr-8 header sm:pb-4 sm:pt-6">
      <div className="flex items-center w-full">
        <img src={NMSIcon} className="mr-2 h-[56] w-[32] sm:mr-4 header__icon sm:h-[88] sm:w-[50]" alt="No Man's Sky Icon" />
        <div>
          <img src="/assets/svg/nms_logo.svg" className="h-[20] w-[234] mb-1 sm:mb-2 sm:h-[32] sm:w-[374] header__logo" alt="No Man's Sky Logo" />
          <h2 className="text-base sm:text-2xl header__title">
            Technology Layout Optimizer <strong>AI</strong> <span className="font-thin">{APP_VERSION}</span>
            {/* Reverted to a span for a less button-like appearance, while maintaining click functionality */}
            <span
              role="button"
              tabIndex={0}
              onClick={() => {
                ReactGA.event({
                  category: "User Interactions",
                  action: "showChangelog",
                });
                onShowChangelog();
              }}
              onKeyDown={(e) => { // Accessibility: Allow activation with Enter/Space
                if (e.key === 'Enter' || e.key === ' ') {
                  ReactGA.event({
                    category: "User Interactions",
                    action: "showChangelog",
                  });
                  onShowChangelog();
                }
              }}
              aria-label="Changelog"
              className="inline-block cursor-pointer" // Ensures it's clickable and has a pointer
            >
              <CounterClockwiseClockIcon className="inline ml-1 sm:w-5 sm:h-5" style={{ color: "var(--accent-11)" }} />
            </span>
          </h2>
        </div>
        <div className="flex items-end ml-auto">
          {" "}
          <img src={NMSShip} className="hidden opacity-25 md:h-[56] md:w-[198] lg:w-[254] lg:h-[72] md:inline fade-horizontal" alt="Starship Image" />
        </div>
      </div>
    </header>
  );
};

// Memoize the component as it has no props and its content is static.
const AppHeader = React.memo(AppHeaderInternal);

export default AppHeader;
