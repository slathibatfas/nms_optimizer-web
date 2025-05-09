import React from "react";

/**
 * ChangeLogContent component displays the version history and changes made
 * to the application in a list format.
 */
const ChangeLogContent: React.FC = () => {
  return (
    <article className="appDialog__article">
      <h2>Model Status</h2>
      <p className="pb-4 border-b-1 border-white/25">
        See this{" "}
        <a
          className="underline"
          href="https://github.com/jbelew/nms_optimizer-service/tree/main/training/trained_models"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub page
        </a>{" "}
        for up to date model information.
      </p>

      <h2 className="pt-2">Version 2.65 (2025-05-09)</h2>
      <ul>
        <li>Added preliminary support for Freighters. Models are still pending. Need to implement shared adjacency logic for fleet technology types.</li>
      </ul>

      <h2>Version 2.61 (2025-05-08)</h2>
      <ul>
        <li>Improved error handling.</li>
      </ul>

      <h2>Version 2.6 (2025-05-07)</h2>
      <ul>
        <li>Added warning for when no solves fit within the grid. Seeing too many users trying to force things and getting sub-optimal results.</li>
        <li>I give in. No one knows what a CNN model is. Marketing wins and we're calling it <strong>AI Technology Optimizer</strong>.</li>
      </ul>

      <h2>Version 2.51 (2025-05-06)</h2>
      <ul>
        <li>Increased "window" size to support better solves for Living Starships.</li>
        <li>Additional mobile UI refinements.</li>
      </ul>

      <h2>Version 2.5 (2025-05-05)</h2>
      <ul>
        <li>Significant UI clean-up, optimization, and refactoring.</li>
      </ul>

      <h2>Version 2.24 (2025-05-03)</h2>
      <ul>
        <li>Added solve quality visuals to notify user when a sub-optimal solve is generated.</li>
      </ul>

      <h2>Version 2.23 (2025-05-03)</h2>
      <ul>
        <li>Updated Starship Trails to provide adjacency to the Tentacled Figurine when more than 5 are available (boosts the hidden speed stat).</li>
      </ul>

      <h2>Version 2.22 (2025-05-03)</h2>
      <ul>
        <li>Improved interaction performance on slower devices.</li>
        <li>Fixed issue where "ghost" modules would sometimes persist after SA/Refine fallback solves were applied.</li>
        <li>Additional UI improvements and enhancements.</li>
      </ul>

      <h2>Version 2.2 (2025-04-24)</h2>
      <ul>
        <li>Refactored opportunity (supercharger) windowing and scoring engine.</li>
        <li>All new, faster, AI models based on 16k samples.</li>
        <li>Added Staves and Solar Starships.</li>
        <li>Now available as a Docker image to run locally.</li>
      </ul>

      <h2>Version 2.1 (2025-04-21)</h2>
      <ul>
        <li>Added correct Boltcaster / Forbidden Upgrade Module relationship.</li>
        <li>Minor bug fixes for MacOS Safari.</li>
      </ul>

      <h2>Version 2.0 (2025-04-19)</h2>
      <ul>
        <li>Renamed tool to Neural Technology Optimizer to reflect its new capabilities.</li>
        <li>Added support for TensorFlow (AI) based solves resulting in an ~5x performance boost.</li>
        <li>Implemented support for Multi-tools.</li>
        <li>New, higher quality, grid graphical assets.</li>
        <li>Various bug fixes, enhancements, and performance improvements.</li>
      </ul>

      <h2>Version 1.1 (2025-04-07)</h2>
      <ul>
        <li>Improved scoring algorithms to provide more consistant solves.</li>
        <li>Minor UI enchancements.</li>
      </ul>

      <h2>Version 1.0 (2025-04-05)</h2>
      <ul>
        <li>Calling it done!</li>
        <li>Additional solver improvements.</li>
      </ul>

      <h2>Version 1.0 (RC3) (2025-04-04)</h2>
      <ul>
        <li>
          Completely refactored scoring algorithm. Please
          <a href="https://github.com/jbelew/nms_optimizer-web/issues" target="_blank" rel="noopener noreferrer">
            file a report
          </a>
          if you identify a persistent issue. Be sure to include a <strong>Share Link</strong> to your solve map.
        </li>
        <li>Calculations now take into account greater and lesser adjacency.</li>
        <li>Core Hyperdrive documented as lesser, but actually performs as greater.</li>
        <li>Improved solver opportunity detection.</li>
        <li>
          Implemented conditional algorithm selection. If a technology has fewer than 6 modules, the solver will use the brute force method; otherwise, it will
          use the simulated annealing algorithm.
        </li>
        <li>Added support for Living Ships.</li>
        <li>Various bug fixes and UI enhancements.</li>
      </ul>

      <h2>Version 0.99.5 (2025-04-01)</h2>
      <ul>
        <li>Added additional tech color coding.</li>
        <li>Introduced upgrade priority labels.</li>
        <li>Refactored the "Shared" link UI.</li>
        <li>Further solver refinements (should be finished!).</li>
        <li>Improved usage of available space in the grid.</li>
      </ul>

      <h2>Version 0.99.1 (2025-03-31)</h2>
      <ul>
        <li>Fixed major flaws in the solver logic.</li>
        <li>Added adjacency color coding.</li>
        <li>Numerous bug fixes.</li>
        <li>Additional UI refinements.</li>
      </ul>

      <h2>Version 0.99 (2025-03-30)</h2>
      <ul>
        <li>Enabled sharing and bookmarking of solves (grid serialization).</li>
        <li>Various UI refinements.</li>
      </ul>

      <h2>Version 0.98 (2025-03-29)</h2>
      <ul>
        <li>Added support for Sentinel Interceptors.</li>
        <li>Major UI updates.</li>
      </ul>

      <h2>Version 0.97 (2025-03-28)</h2>
      <ul>
        <li>Added support for optional modules received as Expedition rewards.</li>
        <li>Additional UI refinements.</li>
        <li>Significant codebase cleanup.</li>
      </ul>

      <h2>Version 0.96 (2025-03-27)</h2>
      <ul>
        <li>
          Further tuning of the <strong>simulated annealing</strong> solver.
        </li>
      </ul>

      <h2>Version 0.95 (2025-03-27)</h2>
      <ul>
        <li>
          Introduced a <strong>simulated annealing</strong> solver and deprecated the brute-force solver due to server timeout issues.
        </li>
        <li>Improved error handling.</li>
      </ul>

      <h2>Version 0.94 (2025-03-26)</h2>
      <ul>
        <li>Added error messaging for solver failures.</li>
        <li>Updated the header.</li>
        <li>Refined mobile UX.</li>
      </ul>

      <h2>Version 0.93 (2025-03-26)</h2>
      <ul>
        <li>Added support for mobile touch events.</li>
        <li>Updated the main font to match Hello Games branding.</li>
        <li>Additional UI refinements.</li>
        <li>Fixed incorrect image mapping for Photon Cannon upgrades.</li>
        <li>Reverted the default grid state to 3 rows.</li>
        <li>Added authorship footer and GitHub repository links.</li>
      </ul>

      <h2>Version 0.91α (2025-03-25)</h2>
      <ul>
        <li>Added Instructions dialog.</li>
        <li>Added Changelog dialog.</li>
        <li>Enhanced UI/UX for mobile devices.</li>
        <li>Fixed an issue where grid refinement failed to find the best solve; improved packing algorithms.</li>
      </ul>

      <h2>Version 0.90α (2025-03-24)</h2>
      <ul>
        <li>Initial alpha release.</li>
        <li>Implemented basic grid functionality.</li>
        <li>Enabled row activation/deactivation.</li>
        <li>Added cell state toggling.</li>
        <li>Integrated optimization API.</li>
        <li>Added grid reset functionality.</li>
      </ul>
    </article>
  );
};

export default React.memo(ChangeLogContent);
