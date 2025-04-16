import React from "react";

const InstructionsContent: React.FC = () => {
  return (
    <>
      <div className="infodialog__item">
        <>
          <h2 className="mb-2 text-xl font-bold">About This Tool</h2>
          <p className="mb-2">
            This tool is for <strong>endgame players</strong> optimizing their technology layouts for maximum efficiency. It is most effective if you:
          </p>
          <ul className="mb-2 infodialog__list">
            <li>
              <strong>Have most or all slots unlocked</strong> on your item.
            </li>
            <li>
              Have access to <strong>all technology upgrades</strong>.
            </li>
            <li>
              Possess a <strong>full set of three upgrade modules</strong> per applicable technology.
            </li>
          </ul>
          <p className="mb-4">
            If you’re still unlocking slots or gathering upgrades, the tool can still offer insights but is primarily intended for{" "}
            <strong>fully equipped and upgraded items</strong>.
          </p>

          <h2 className="mb-2 text-xl font-bold">Basic Usage</h2>
          <ul className="mb-4 infodialog__list">
            <li>
              <strong>Click or tap</strong> a cell to toggle its <em>Supercharged</em> state (max 4).
            </li>
            <li>
              <strong>Ctrl-click or long press</strong> to enable/disable individual cells.
            </li>
            <li>
              Use the <strong>row activation buttons</strong> on the right to enable/disable entire rows. These buttons are disabled once modules are placed,
              until you press <strong>Reset Grid</strong>.
            </li>
          </ul>

          <h2 className="mb-2 text-xl font-bold">Tips for Multi-Tech Layouts</h2>
          <p className="mb-2">
            The system is designed to prioritize supercharged slots, which can lead to "greedy" behavior in the layout process. For{" "}
            <strong>square or L-shaped supercharged layouts</strong> across multiple technology types:
          </p>
          <ul className="mb-2 infodialog__list">
            <li>
              <strong>Activate only a few supercharged slots</strong> and solve for the first technology.
            </li>
            <li>
              <strong>Activate the remaining supercharged slots</strong> and solve for the next technology.
            </li>
          </ul>
          <p className="mb-4">
            This approach ensures that each technology benefits from an optimized layout without interfering with the previous tech's solve.
          </p>

          <h2 className="mb-2 text-xl font-bold">How the Optimizer Works</h2>
          <p className="mb-2">The optimizer figures out the best module layout for your platform by following these steps:</p>
          <ol className="mb-2 infodialog__list">
            <li className="infodialog__list-item">
              <strong>Starts with proven layouts (best practices):</strong> It checks a library of high-scoring patterns for your selected tech. It tries
              fitting these patterns onto your grid in different positions and rotations, making sure they work with your supercharged and inactive slots. If
              one fits well and scores high, it uses that as a strong starting point.
            </li>
            <li className="infodialog__list-item">
              <strong>Makes a smart guess using AI (experimental):</strong> If no known layout fits—or if you're using experimental mode—the optimizer uses an
              AI model trained on thousands of examples. It quickly predicts a promising layout based on the configuration of your grid.
            </li>
            <li className="infodialog__list-item">
              <strong>Refines and polishes the layout:</strong> Whether it started with a known pattern or an AI prediction, it improves the layout through
              refinement:
              <ul className="mt-1 infodialog__list">
                <li className="infodialog__list-item">
                  <strong>Intelligent swapping & moving:</strong> It tries swapping modules or moving one to an empty active slot.
                </li>
                <li className="infodialog__list-item">
                  <strong>Score checking:</strong> After each change, it recalculates your total bonus score.
                </li>
                <li className="infodialog__list-item">
                  <strong>Keeps what works:</strong> It only keeps changes that improve the score, repeating this until no further improvements are found.
                </li>
              </ul>
              (For smaller layouts, it might even check every possible arrangement!)
            </li>
            <li className="infodialog__list-item">
              <strong>Presents the best result:</strong> After all refinements, the optimizer shows the layout that achieved the highest bonus score during the
              process.
            </li>
          </ol>
        </>
      </div>
    </>
  );
};

export default React.memo(InstructionsContent);
