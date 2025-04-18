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
              <strong>Ctrl-click (or long press on touch devices)</strong> to enable/disable individual cells.
            </li>
            <li>
              Use the <strong>row activation buttons</strong> on the right to enable/disable entire rows. These buttons are disabled once modules are placed,
              until you press <strong>Reset Grid</strong>. 
            </li>
          </ul>

          <h2 className="mb-2 text-xl font-bold">Usage Tips</h2>
<p className="mb-2">
  Supercharged slots offer powerful bonuses, but the solver tends to prioritize them heavily. This can sometimes lead to "greedy" placements that don’t reflect your overall plan. Unless you're deliberately building a 4-square or L-shape layout for a single technology, you’ll get better results by following this approach:
</p>
<ul className="mb-2 infodialog__list">
  <li>
    <strong>Start with just a few supercharged slots activated</strong>, and solve for your first technology.
  </li>
  <li>
    <strong>Enable additional supercharged slots</strong> as you solve for each new technology to want to boost.
  </li>
</ul>
<p className="mb-2">
  Think of this tool as a puzzle assistant — it helps you explore layouts, but it doesn’t know your full strategy. The best results come from iterating. After filling your supercharged slots, focus on placing larger technologies like <strong>Hyperdrive</strong> and <strong>Starship Trails</strong> while space is still available.
</p>
<p className="mb-4">
  If you run out of space or aren’t getting the results you want, don’t hesitate to backtrack a few steps and try a different order. Small changes early in the process can lead to better final layouts.
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
