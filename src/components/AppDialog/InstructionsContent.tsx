import React from "react";
import { GearIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

const InstructionsContent: React.FC = () => {
  return (
    <>
      <article className="appDialog__article">
        <h2>About This Tool</h2>
        <p>
          This tool is for <strong>endgame players</strong> optimizing their technology layouts for maximum efficiency. It is most effective if you:
        </p>
        <ul>
          <li>Have most or all slots unlocked on your item.</li>
          <li>Have access to all technology upgrades.</li>
          <li>Possess a full set of three upgrade modules per applicable technology.</li>
        </ul>
        <p>
          If you're still unlocking slots or gathering upgrades, the tool can still offer insights, but it is primarily intended for{" "}
          <strong>fully equipped and upgraded items</strong>.
        </p>

        <h2 >Basic Usage</h2>
        <ul>
          <li>
            <strong>Click or tap</strong> the
            <span className="pl-1 pr-1">
              <IconButton size="1" variant="soft">
                <GearIcon className="w-6 h-6" />
              </IconButton>
            </span>
            button to select you Starship or Multi-tool type.
          </li>
          <li>
            <strong>Click or tap</strong> a cell to toggle its <em>Supercharged</em> state (a maximum of 4).
          </li>
          <li>
            <strong>Ctrl-click (or long press on touch devices)</strong> to enable/disable individual cells.
          </li>
          <li>
            Use the <strong>row activation buttons</strong> on the right to enable/disable entire rows. These buttons are disabled once modules are placed,
            until you press <strong>Reset Grid</strong>.
          </li>
        </ul>

        <h2>Usage Tips</h2>
        <p>
          Supercharged slots offer powerful bonuses, but they're fixed, so your strategy should focus on making the most of where they are.{" "}
          <strong>Don't just click all four supercharged slots to match your ship's config.</strong> Here's how to get the best results:
        </p>
        <ul>
          <li>
            <strong>Start by choosing one technology that aligns well with two or three of your supercharged slots</strong>, such as the <em>Pulse Engine</em>,{" "}
            <em>Infra-Knife Accelerator</em>, <em>Pulse Spitter</em>, or <em>Neutron Cannon</em> —{" "}
            <strong>click on those cells to mark them as supercharged</strong>, then solve for that technology first.
          </li>
          <li>
            <strong>Use the remaining supercharged coverage (if any) for your second priority</strong>, such as one of the <em>Hyperdrive</em> systems,{" "}
            <em>Scanner</em>, or <em>Mining Beam</em>, <strong>and click to activate your remaining supercharged slots</strong>, then solve for that.
            Distributing the bonuses across multiple key technologies often yields better results than stacking all four on a single one.
          </li>
          <li>
            <strong>After solving your supercharged priorities, focus on solving for large, space-hungry technologies</strong> like the <em>Hyperdrive</em> or{" "}
            <em>Starship Trails</em> while there's still room to position them effectively.
          </li>
        </ul>

        <p>
          This tool does the heavy lifting, optimizing placement for the highest bonus score based on your choices. Your job is to guide it by prioritizing the
          right technologies for your play style.
        </p>

        <p>
          As the grid fills out, you might run out of space to place those last few technologies effectively. If that happens,{" "}
          <strong>reset a few technologies and try adjusting the order in which you solve</strong>. With a fully spec'd-out ship, it can be a tight fit, and you
          may only have one open slot at the end.
        </p>

        <p>
          <strong>My personal starship recommendation:</strong> Consider dedicating{" "}
          <strong>two supercharged slots for your favorite weapons and two for your Pulse Engines</strong> — this balance gives you both great DPS and
          maneuverability.
        </p>

        <h2>Pro-Tip</h2>
        <p>
          There's some good <strong>math</strong> behind finding the best location for a solve, but <strong>if it's just not working for you</strong>, try
          temporarily marking a few cells as <strong>disabled</strong> to help force the solve into the location you think is best. This can help you work
          around grid constraints and focus on placing technologies where you'd see they'd fit better.
        </p>

        <h2>How the Optimizer Works</h2>
        <p>The optimizer figures out the best module layout for your platform by following these steps:</p>
        <ul>
          <li>
            <strong>Starts with proven layouts (best practices):</strong> It checks a library of high-scoring patterns for your selected tech. It tries fitting
            these patterns onto your grid in different positions and rotations, making sure they work with your supercharged and inactive slots. If one fits
            well and scores high, it uses that as a strong starting point.
          </li>
          <li>
            <strong>Makes a smart guess using AI:</strong> Once a pattern is found that works well, the optimizer uses an AI model trained on thousands of
            examples to best utilize any available supercharged slots. It quickly predicts a promising layout based on the configuration of your grid.
          </li>
          <li>
            <strong>Refines and polishes the layout:</strong> Whether it started with a known pattern or an AI prediction, it improves the layout through
            refinement:
            <ul>
              <li>
                <strong>Intelligent swapping & moving:</strong> It tries swapping modules or moving one to an empty active slot.
              </li>
              <li>
                <strong>Score checking:</strong> After each change, it recalculates your total bonus score.
              </li>
              <li>
                <strong>Keeps what works:</strong> It only keeps changes that improve the score, repeating this until no further improvements are found.
              </li>
            </ul>
          </li>
          <li>
            <strong>Presents the best result:</strong> After all refinements, the optimizer shows the layout that achieved the highest bonus score during the
            process.
          </li>
        </ul>
      </article>
    </>
  );
};

export default React.memo(InstructionsContent);
