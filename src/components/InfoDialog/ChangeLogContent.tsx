import React from "react";

const ChangeLogContent: React.FC = () => {
  return (
    <>
      <div className="infodialog__title">Changelog</div>
      <div className="infodialog__item">
      <div className="infodialog__item">
          <h3 className="mb-2 font-bold">Version 0.985 (2025-03-30)</h3>
          <ul className="infodialog__list">
            <li className="infodialog__list-item">UI refinements.</li>
          </ul>
        </div>
        <div className="infodialog__item">
          <h3 className="mb-2 font-bold">Version 0.98 (2025-03-29)</h3>
          <ul className="infodialog__list">
            <li className="infodialog__list-item">Added support for Sentinel Interceptors.</li>
            <li className="infodialog__list-item">Major UI updates.</li>
          </ul>
        </div>
        <div className="infodialog__item">
          <h3 className="mb-2 font-bold">Version 0.97 (2025-03-28)</h3>
          <ul className="infodialog__list">
            <li className="infodialog__list-item">Added support for optional modules received as Expedition Rewards.</li>
            <li className="infodialog__list-item">Additional UI refinements.</li>
            <li className="infodialog__list-item">Significant codebase cleanup.</li>
          </ul>
        </div>
        <div className="infodialog__item">
          <h3 className="mb-2 font-bold">Version 0.96 (2025-03-27)</h3>
          <ul className="infodialog__list">
            <li className="infodialog__list-item">
              Further tuning of the <strong>simulated annealing</strong> solver.
            </li>
          </ul>
        </div>
        <div className="infodialog__item">
          <h3 className="mb-2 font-bold">Version 0.95 (2025-03-27)</h3>
          <ul className="infodialog__list">
            <li className="infodialog__list-item">
              Introduced a <strong>simulated annealing</strong> solver and deprecated the brute-force solver due to server timeout issues.
            </li>
            <li className="infodialog__list-item">Improved error handling.</li>
          </ul>
        </div>
        <div className="infodialog__item">
          <h3 className="mb-2 font-bold">Version 0.94 (2025-03-26)</h3>
          <ul className="infodialog__list">
            <li className="infodialog__list-item">Added an error message for solver failures.</li>
            <li className="infodialog__list-item">Updated the header.</li>
            <li className="infodialog__list-item">Refined mobile UX.</li>
          </ul>
        </div>
        <div className="infodialog__item">
          <h3 className="mb-2 font-bold">Version 0.93 (2025-03-26)</h3>
          <ul className="infodialog__list">
            <li className="infodialog__list-item">Added support for mobile touch events.</li>
            <li className="infodialog__list-item">Updated main font to match current Hello Games branding.</li>
            <li className="infodialog__list-item">Additional UI refinements.</li>
            <li className="infodialog__list-item">Fixed incorrect image mapping for Photon Cannon upgrades.</li>
            <li className="infodialog__list-item">Reverted default grid state to 3 rows.</li>
            <li className="infodialog__list-item">Added authorship footer and GitHub repo links.</li>
          </ul>
        </div>
        <div className="infodialog__item">
          <h3 className="mb-2 font-bold">Version 0.91α (2025-03-25)</h3>
          <ul className="infodialog__list">
            <li className="infodialog__list-item">Added Instructions Dialog.</li>
            <li className="infodialog__list-item">Added Changelog Dialog.</li>
            <li className="infodialog__list-item">Enhanced UI/UX on mobile devices.</li>
            <li className="infodialog__list-item">Fixed an issue with grid refinement not finding the best solve; improved packing algorithms.</li>
          </ul>
        </div>
        <div className="infodialog__item">
          <h3 className="mb-2 font-bold">Version 0.90α (2025-03-24)</h3>
          <ul className="infodialog__list">
            <li className="infodialog__list-item">Initial alpha release.</li>
            <li className="infodialog__list-item">Implemented basic grid functionality.</li>
            <li className="infodialog__list-item">Enabled row activation/deactivation.</li>
            <li className="infodialog__list-item">Added cell state toggling.</li>
            <li className="infodialog__list-item">Integrated optimization API.</li>
            <li className="infodialog__list-item">Added grid reset functionality.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ChangeLogContent;
