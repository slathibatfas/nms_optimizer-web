import React from "react";

const ChangeLogContent: React.FC = () => {
  return (
    <>
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 1.0 (Release Candidate 1) (2025-04-03)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">
            Completely refactored scoring algorithm. Please{" "}
            <a href="https://github.com/jbelew/nms_optimizer-web/issues" className="underline" target="_blank" rel="noopener noreferrer">
              file a report
            </a>{" "}
            if you identify a persistent issue. Be sure to include a <strong>Share Link</strong> to your solve map.
          </li>
          <li className="infodialog__list-item">Added support for Living Ships.</li>
          <li className="infodialog__list-item">Various bug fixes and UI enhancements.</li>
        </ul>
      </div>

      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.99.5 (2025-04-01)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Added additional tech color coding.</li>
          <li className="infodialog__list-item">Introduced upgrade priority labels.</li>
          <li className="infodialog__list-item">Refactored the "Shared" link UI.</li>
          <li className="infodialog__list-item">Further solver refinements (should be finished!).</li>
          <li className="infodialog__list-item">Improved usage of available space in the grid.</li>
        </ul>
      </div>

      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.99.1 (2025-03-31)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Fixed major flaws in the solver logic.</li>
          <li className="infodialog__list-item">Added adjacency color coding.</li>
          <li className="infodialog__list-item">Numerous bug fixes.</li>
          <li className="infodialog__list-item">Additional UI refinements.</li>
        </ul>
      </div>

      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.99 (2025-03-30)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Enabled sharing and bookmarking of solves (grid serialization).</li>
          <li className="infodialog__list-item">Various UI refinements.</li>
        </ul>
      </div>

      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.98 (2025-03-29)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Added support for Sentinel Interceptors.</li>
          <li className="infodialog__list-item">Major UI updates.</li>
        </ul>
      </div>

      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.97 (2025-03-28)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Added support for optional modules received as Expedition rewards.</li>
          <li className="infodialog__list-item">Additional UI refinements.</li>
          <li className="infodialog__list-item">Significant codebase cleanup.</li>
        </ul>
      </div>

      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.96 (2025-03-27)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">
            Further tuning of the <strong>simulated annealing</strong> solver.
          </li>
        </ul>
      </div>

      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.95 (2025-03-27)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">
            Introduced a <strong>simulated annealing</strong> solver and deprecated the brute-force solver due to server timeout issues.
          </li>
          <li className="infodialog__list-item">Improved error handling.</li>
        </ul>
      </div>

      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.94 (2025-03-26)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Added error messaging for solver failures.</li>
          <li className="infodialog__list-item">Updated the header.</li>
          <li className="infodialog__list-item">Refined mobile UX.</li>
        </ul>
      </div>

      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.93 (2025-03-26)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Added support for mobile touch events.</li>
          <li className="infodialog__list-item">Updated the main font to match Hello Games branding.</li>
          <li className="infodialog__list-item">Additional UI refinements.</li>
          <li className="infodialog__list-item">Fixed incorrect image mapping for Photon Cannon upgrades.</li>
          <li className="infodialog__list-item">Reverted the default grid state to 3 rows.</li>
          <li className="infodialog__list-item">Added authorship footer and GitHub repository links.</li>
        </ul>
      </div>

      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.91α (2025-03-25)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Added Instructions dialog.</li>
          <li className="infodialog__list-item">Added Changelog dialog.</li>
          <li className="infodialog__list-item">Enhanced UI/UX for mobile devices.</li>
          <li className="infodialog__list-item">Fixed an issue where grid refinement failed to find the best solve; improved packing algorithms.</li>
        </ul>
      </div>

      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.90α (2025-03-24)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Initial alpha release.</li>
          <li className="infodialog__list-item">Implemented basic grid functionality.</li>
          <li className="infodialog__list-item">Enabled row activation/deactivation.</li>
          <li className="infodialog__list-item">Added cell state toggling.</li>
          <li className="infodialog__list-item">Integrated optimization API.</li>
          <li className="infodialog__list-item">Added grid reset functionality.</li>
        </ul>
      </div>
    </>
  );
};

export default ChangeLogContent;
