import React from "react";

/**
 * ChangeLogContent component displays the version history and changes made
 * to the application in a list format.
 */
const ChangeLogContent: React.FC = () => {
  return (
    <>

      <div className="border-b-1 border-white/5 infodialog__item">
        <h2 className="mb-2 font-bold">Model Status</h2>
        <p className="mb-2">See this <a className="underline" href="https://github.com/jbelew/nms_optimizer-service/tree/main/training/trained_models" target="_blank" rel="noopener noreferrer">GitHub page</a> for up to date model information.</p>
      </div>

      {/* Version 2.0 */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 2.1 (2025-04-21</h2>
        <ul className="infodialog__list">
        <li className="infodialog__list-item">Refactored the scoring engine yet again. Still need to track down Pulse Engine edge case.</li>
        <li className="infodialog__list-item">Minor bug fixes for MacOS Safari.</li>
        </ul>
      </div>

      {/* Version 2.0 */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 2.0 (2025-04-19)</h2>
        <ul className="infodialog__list">
        <li className="infodialog__list-item">Renamed tool to Neural Technology Optimizer to reflect its new capabilities.</li>
        <li className="infodialog__list-item">Added support for TensorFlow (AI) based solves resulting in an ~5x performance boost.</li>
        <li className="infodialog__list-item">Implemented support for Multi-tools.</li>
        <li className="infodialog__list-item">New, higher quality, grid graphical assets.</li>
        <li className="infodialog__list-item">Various bug fixes, enhancements, and performance improvements.</li>
        </ul>
      </div>

      {/* Version 1.1 */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 1.1 (2025-04-07)</h2>
        <ul className="infodialog__list">
        <li className="infodialog__list-item">Improved scoring algorithms to provide more consistant solves.</li>
        <li className="infodialog__list-item">Minor UI enchancements.</li>
        </ul>
      </div>

      {/* Version 1.0 */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 1.0 (2025-04-05)</h2>
        <ul className="infodialog__list">
        <li className="infodialog__list-item">Calling it done!</li>
        <li className="infodialog__list-item">Additional solver improvements.</li>
        </ul>
      </div>

      {/* Version 1.0 */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 1.0 (RC3) (2025-04-04)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">
            Completely refactored scoring algorithm. Please{" "}
            <a href="https://github.com/jbelew/nms_optimizer-web/issues" className="underline" target="_blank" rel="noopener noreferrer">
              file a report
            </a>{" "}
            if you identify a persistent issue. Be sure to include a <strong>Share Link</strong> to your solve map.
          </li>
          <li className="infodialog__list-item">Calculations now take into account greater and lesser adjacency.</li>
          <li className="infodialog__list-item">Core Hyperdrive documented as lessers, but actually perform as greater.</li>
          <li className="infodialog__list-item">Improved solver opportunity detection.</li>
          <li className="infodialog__list-item">
            Implemented conditional algorithm selection. If a technology has fewer than 6 modules, the solver will use the brute force method; otherwise, it
            will use the simulated annealing algorithm.
          </li>
          <li className="infodialog__list-item">Added support for Living Ships.</li>
          <li className="infodialog__list-item">Various bug fixes and UI enhancements.</li>
        </ul>
      </div>

      {/* Version 0.99.5 */}
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

      {/* Version 0.99.1 */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.99.1 (2025-03-31)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Fixed major flaws in the solver logic.</li>
          <li className="infodialog__list-item">Added adjacency color coding.</li>
          <li className="infodialog__list-item">Numerous bug fixes.</li>
          <li className="infodialog__list-item">Additional UI refinements.</li>
        </ul>
      </div>

      {/* Version 0.99 */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.99 (2025-03-30)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Enabled sharing and bookmarking of solves (grid serialization).</li>
          <li className="infodialog__list-item">Various UI refinements.</li>
        </ul>
      </div>

      {/* Version 0.98 */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.98 (2025-03-29)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Added support for Sentinel Interceptors.</li>
          <li className="infodialog__list-item">Major UI updates.</li>
        </ul>
      </div>

      {/* Version 0.97 */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.97 (2025-03-28)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Added support for optional modules received as Expedition rewards.</li>
          <li className="infodialog__list-item">Additional UI refinements.</li>
          <li className="infodialog__list-item">Significant codebase cleanup.</li>
        </ul>
      </div>

      {/* Version 0.96 */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.96 (2025-03-27)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">
            Further tuning of the <strong>simulated annealing</strong> solver.
          </li>
        </ul>
      </div>

      {/* Version 0.95 */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.95 (2025-03-27)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">
            Introduced a <strong>simulated annealing</strong> solver and deprecated the brute-force solver due to server timeout issues.
          </li>
          <li className="infodialog__list-item">Improved error handling.</li>
        </ul>
      </div>

      {/* Version 0.94 */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.94 (2025-03-26)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Added error messaging for solver failures.</li>
          <li className="infodialog__list-item">Updated the header.</li>
          <li className="infodialog__list-item">Refined mobile UX.</li>
        </ul>
      </div>

      {/* Version 0.93 */}
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

      {/* Version 0.91α */}
      <div className="infodialog__item">
        <h2 className="mb-2 font-bold">Version 0.91α (2025-03-25)</h2>
        <ul className="infodialog__list">
          <li className="infodialog__list-item">Added Instructions dialog.</li>
          <li className="infodialog__list-item">Added Changelog dialog.</li>
          <li className="infodialog__list-item">Enhanced UI/UX for mobile devices.</li>
          <li className="infodialog__list-item">Fixed an issue where grid refinement failed to find the best solve; improved packing algorithms.</li>
        </ul>
      </div>

      {/* Version 0.90α */}
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

export default React.memo(ChangeLogContent);
