// src/components/AppHeader/AppHeader.tsx
import React from "react";
import NMSIcon from "../../assets/img/nms_icon2.webp";
import NMSLogo from "../../assets/svg/nms_logo.svg";
import NMSShip from "../../assets/img/ship.png";
import { APP_VERSION } from "../../constants";

// Consider getting version from env vars if desired

const AppHeader: React.FC = () => {
  return (
    <header className="flex flex-col pt-3 pb-1 pl-6 sm:pr-8 header sm:pb-4 sm:pt-6">
      <div className="flex items-center w-full"> {/* Changed items-start to items-center */}
        <img src={NMSIcon} className="mr-4 h-14 sm:mr-4 header__icon sm:h-22" alt="No Man's Sky Icon" />
        <div>
          <img src={NMSLogo} className="h-5 mb-1 sm:mb-2 sm:h-8 header__logo" alt="No Man's Sky Logo" />
          {/* <h1 className="text-2xl sm:text-4xl">No Man's Sky</h1> */}
          <h2 className="text-base sm:text-2xl header__title">
            <strong>AI</strong> Technology Optimizer <span className="font-thin">{APP_VERSION}</span>
          </h2>
        </div>
        <div className="flex items-end ml-auto"> {/* Added ml-auto */}
          <img src={NMSShip} className="hidden opacity-25 md:h-14 lg:h-18 md:inline fade-horizontal" />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
