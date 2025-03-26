import React from "react";

const InstructionsContent: React.FC = () => {
  return (
    <>
      <div className="infodialog__title">Instructions</div>
      <div className="infodialog__item">
        <>
          <h2 className="mb-2 font-bold">Basic Usage</h2>

          <ul className="mb-4 infodialog__list">
            <li>
              <strong>Click</strong> a cell to toggle its <em>Supercharged</em> state. No more than 4.
            </li>
            <li>
              <strong>Ctrl-Click</strong> on a cell to enable or disable it individually.
            </li>
            <li>
              Use the buttons on the right to <strong>Activate</strong> or <strong>Deactivate</strong> entire rows at once.
            </li>
          </ul>

          <h2 className="mb-2 font-bold">Upgrade Modules & Scoring</h2>

          <ul className="mb-4 infodialog__list">
            <li>
              Upgrade modules are labeled <strong>Sigma, Tau, and Theta</strong>, which are visible via the <strong>tooltip UI element</strong>.
            </li>
            <li>
              For the <strong>best score</strong>, arrange upgrades so that:
              <ul>
                <li>
                  <strong>Sigma</strong> is the best upgrade you have for that technology.
                </li>
                <li>
                  <strong>Theta</strong> is the weakest upgrade.
                </li>
              </ul>
            </li>
            <li>Following this order ensures that bonuses are maximized when the optimizer arranges modules.</li>
          </ul>

          <h2 className="mb-2 font-bold">Tips for Usage</h2>

          <p>
            If you want to use a <strong>4SC (four supercharged slots) or an L-shaped supercharger layout</strong> across multiple technology types, follow this
            approach:
          </p>
          <ul className="mb-4 infodialog__list">
            <li>
              <strong>Start by activating only a couple of supercharged slots</strong> and solve for the first technology type.
            </li>
            <li>
              <strong>Once the solution is set, activate the remaining supercharged slots</strong> and solve for the next technology type.
            </li>
          </ul>
          <p className="mb-4">This ensures that each technology benefits from the same optimized supercharger layout without interfering with previous solves.</p>

          <h2 className="mb-2 font-bold">How the Optimizer Finds the Best Layout</h2>

          <p className="mb-4">
            The optimizer's job is to figure out the best way to arrange your ship's technology modules to get the highest possible bonus. It does this in a few
            steps:
          </p>

          <ol className="mb-4 infodialog__list">
            <li className="infodialog__list-item">
              <strong>Looks for a Known Solution:</strong> First, it checks if it already knows a good layout for the specific ship and technology you've
              chosen. These "known solutions" are like pre-made templates that are usually very effective. These are stored in the <code>solves</code>{" "}
              dictionary.
            </li>
            <li className="infodialog__list-item">
              <strong>Tries Different Orientations:</strong> If it finds a known solution, it doesn't just use it as-is. It cleverly tries rotating and flipping
              the template in all possible ways to see if a different orientation works even better on your specific grid. It will also try mirroring the
              template.
            </li>
            <li className="infodialog__list-item">
              <strong>Fits the Template:</strong> It then attempts to fit this template onto your grid, trying it in every possible position. It will only place
              modules in empty slots, and will not overwrite modules of a different technology.
            </li>
            <li className="infodialog__list-item">
              <strong>Checks for Supercharged Opportunities:</strong> After placing the template, it looks for opportunities to improve the layout by utilizing
              additional supercharged slots. It will try to move modules around to take advantage of these slots. It will focus on supercharged slots that are
              on the outer edge of the solve.
            </li>
            <li className="infodialog__list-item">
              <strong>Brute-Force Backup:</strong> If it can't find a known solution, or if the template doesn't fit perfectly, it switches to a "brute-force"
              method. This means it tries placing each module in every possible empty spot, one by one, to find the best arrangement. This is slower, but it
              guarantees it will find the best possible layout.
            </li>
            <li className="infodialog__list-item">
              <strong>Calculates the Score:</strong> After each attempt, it calculates a score based on how well the modules are connected and how they interact
              with supercharged slots.
            </li>
            <li className="infodialog__list-item">
              <strong>Keeps the Best:</strong> It keeps track of the highest score it finds and the layout that produced it.
            </li>
            <li className="infodialog__list-item">
              <strong>Returns the Winner:</strong> Finally, it gives you the layout with the highest score, which is the best arrangement it could find.
            </li>
          </ol>

          <p>
            <strong>In short:</strong> The optimizer is like a puzzle solver. It either uses a pre-solved puzzle (template) and adapts it, or it tries every
            possible combination until it finds the best one. It then refines the solution by looking for supercharged opportunities. It's designed to find the
            absolute best way to arrange your modules for maximum benefit.
          </p>
        </>
      </div>
    </>
  );
};

export default InstructionsContent;
