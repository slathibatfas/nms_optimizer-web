import React from "react";

const InstructionsContent: React.FC = () => {
  return (
	<>
<div className="infodialog__item">
  <>
    <h2 className="mb-2 font-bold">About This Tool</h2>
    <p className="mb-4">
      This tool is for <strong>endgame players</strong> optimizing their starship layouts for maximum efficiency. It is most effective if you:
    </p>
    <ul className="mb-4 infodialog__list">
      <li><strong>Have most or all slots unlocked</strong> in your starship.</li>
      <li>Have access to <strong>all technology upgrades</strong>.</li>
      <li>Possess a <strong>full set of three upgrade modules</strong> per applicable technology.</li>
    </ul>
    <p className="mb-4">
      If you’re still unlocking slots or gathering upgrades, the tool can still offer insights but is primarily intended for <strong>fully equipped and upgraded ships</strong>.
    </p>

    <h2 className="mb-2 font-bold">Basic Usage</h2>
    <ul className="mb-4 infodialog__list">
      <li><strong>Click or tap</strong> a cell to toggle its <em>Supercharged</em> state (max 4).</li>
      <li><strong>Ctrl-click or long press</strong> to enable/disable individual cells.</li>
      <li>Use the <strong>row activation buttons</strong> on the right to enable/disable entire rows. These buttons are disabled once modules are placed, until you press <strong>Reset Grid</strong>.</li>
    </ul>

    <h2 className="mb-2 font-bold">Solving Times and Quality</h2>
    <p className="mb-4">
      When you have open supercharged slots, the tool will use a <strong>Simulated Annealing</strong> algorithm to attempt to find the best placement. These solves typically take around <strong>20 seconds</strong> and are usually the best available <strong>98% of the time</strong>.
    </p>
    <ul className="mb-4 infodialog__list">
      <li><strong>Quality of Solves:</strong> The longer the algorithm runs, the better the quality of the solve, but there is a <strong>hard limit of 30 seconds</strong> for each attempt to prevent excessive processing time.</li>
      <li><strong>Occasional Issues:</strong> On rare occasions, the simulated annealing solve may return results that are obviously questionable. If that happens, simply <strong>re-run the solve</strong> for a better solution.</li>
    </ul>
	<p className="mb-4">Simulated annealing with also kick in if you attempt to place technology but lack space for a proper solve on the grid. It will simply attempt to give you the best solution it can find.</p>

    <h2 className="mb-2 font-bold">Upgrade Modules & Scoring</h2>
    <p className="mb-4">
      Upgrade modules are labeled <strong>Sigma, Tau, and Theta</strong> (visible via tooltips). To maximize in-game scoring:
    </p>
    <ul className="mb-4 infodialog__list">
      <li><strong>Sigma</strong> should be the best upgrade available.</li>
      <li><strong>Theta</strong> should be the weakest.</li>
    </ul>

    <h2 className="mb-2 font-bold">Tips for Multi-Tech Layouts</h2>
    <p className="mb-4">
      For <strong>Square or L-shaped supercharged layouts</strong> across multiple technology types:
    </p>
    <ul className="mb-4 infodialog__list">
      <li><strong>Activate only a few supercharged slots</strong> and solve for the first technology.</li>
      <li><strong>Then activate the remaining supercharged slots</strong> and solve for the next technology.</li>
    </ul>
    <p className="mb-4">
      This ensures all technologies benefit from an optimized layout without interfering with prior solves.
    </p>

    <h2 className="mb-2 font-bold">How the Optimizer Works</h2>
    <p className="mb-4">
      The optimizer finds the best module arrangement through the following steps:
    </p>
    <ol className="mb-4 infodialog__list">
      <li className="infodialog__list-item"><strong>Checks for a known solution:</strong> It first checks if it already knows a good layout for your ship and technology.</li>
      <li className="infodialog__list-item"><strong>Tests orientations against your grid:</strong> It rotates and mirrors the template to find the best fit for your grid.</li>
      <li className="infodialog__list-item"><strong>Looks for additional supercharged slots in range:</strong> It adjusts placements to maximize supercharged slot benefits.</li>
      <li className="infodialog__list-item"><strong>Uses brute-force if needed:</strong> If no known solution fits, it tries all possible placements to find the best configuration.</li>
      <li className="infodialog__list-item"><strong>Scores each layout:</strong> It calculates a score based on adjacency bonuses and supercharged interactions.</li>
      <li className="infodialog__list-item"><strong>Selects the highest-scoring layout:</strong> It returns the best arrangement based on the highest score.</li>
    </ol>
    <p className="mb-4">
      <strong>In short:</strong> The optimizer acts like a puzzle solver, using pre-solved templates when possible or testing all placements to find the best configuration. It then refines the layout by leveraging available supercharged slots for maximum efficiency.
    </p>
  </>
</div>

	</>
  );
};

export default InstructionsContent;
