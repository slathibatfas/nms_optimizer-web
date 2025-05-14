import React from "react";
import { GearIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

const InstructionsContent: React.FC = () => {
  return (
    <>
      <article className="appDialog__body">
        <h2 className="appDialog__subheading">About This Tool</h2>
        <p className="appDialog__text">
          This tool is for <strong>endgame players</strong> optimizing their technology layouts for maximum efficiency. It is most effective if you:
        </p>
        <ul className="appDialog__list">
          <li className="appDialog__listItem">Have most or all slots unlocked on your item.</li>
          <li className="appDialog__listItem">Have access to all technology upgrades.</li>
          <li className="appDialog__listItem">Possess a full set of three upgrade modules per applicable technology.</li>
        </ul>
        <p className="appDialog__text">
          If you're still unlocking slots or gathering upgrades, the tool can still offer insights, but it is primarily intended for{" "}
          <strong>fully equipped and upgraded items</strong>.
        </p>

        <h2 className="appDialog__subheading">Basic Usage</h2>
        <ul className="appDialog__list">
          <li className="appDialog__listItem">
            <strong>Click or tap</strong> the
            <span className="pl-1 pr-1">
              <IconButton size="1" variant="soft">
                <GearIcon className="w-6 h-6" />
              </IconButton>
            </span>
            button to select you Starship or Multi-tool type.
          </li>
          <li className="appDialog__listItem">
            <strong>Click or tap</strong> a cell to toggle its <em>Supercharged</em> state (a maximum of 4).
          </li>
          <li className="appDialog__listItem">
            <strong>Ctrl-click (or long press on touch devices)</strong> to enable/disable individual cells.
          </li>
          <li className="appDialog__listItem">
            Use the <strong>row activation buttons</strong> on the right to enable/disable entire rows. These buttons are disabled once modules are placed,
            until you press <strong>Reset Grid</strong>.
          </li>
        </ul>

        <h2 className="appDialog__subheading">Usage Tips</h2>
        <p className="appDialog__text">
          Supercharged slots offer powerful bonuses, but they're fixed, so your strategy should focus on making the most of where they are.{" "}
          <strong>Don't just click all four supercharged slots to match your ship's config.</strong> Here's how to get the best results:
        </p>
        <ul className="appDialog__list">
          <li className="appDialog__listItem">
            <strong>Start by choosing one technology that aligns well with two or three of your supercharged slots</strong>, such as the <em>Pulse Engine</em>,{" "}
            <em>Infra-Knife Accelerator</em>, <em>Pulse Spitter</em>, or <em>Neutron Cannon</em> —{" "}
            <strong>click on those cells to mark them as supercharged</strong>, then solve for that technology first.
          </li>
          <li className="appDialog__listItem">
            <strong>Use the remaining supercharged coverage (if any) for your second priority</strong>, such as one of the <em>Hyperdrive</em> systems,{" "}
            <em>Scanner</em>, or <em>Mining Beam</em>, <strong>and click to activate your remaining supercharged slots</strong>, then solve for that.
            Distributing the bonuses across multiple key technologies often yields better results than stacking all four on a single one.
          </li>
          <li className="appDialog__listItem">
            <strong>After solving your supercharged priorities, focus on solving for large, space-hungry technologies</strong> like the <em>Hyperdrive</em> or{" "}
            <em>Starship Trails</em> while there's still room to position them effectively.
          </li>
        </ul>

        <p className="appDialog__text">
          This tool does the heavy lifting, optimizing placement for the highest bonus score based on your choices. Your job is to guide it by prioritizing the
          right technologies for your play style.
        </p>

        <p className="appDialog__text">
          As the grid fills out, you might run out of space to place those last few technologies effectively. If that happens,{" "}
          <strong>reset a few technologies and try adjusting the order in which you solve</strong>. With a fully spec'd-out ship, it can be a tight fit, and you
          may only have one open slot at the end.
        </p>

        <h2 className="appDialog__subheading">Pro-Tip</h2>
        <p className="appDialog__text">
          There's some good <strong>math</strong> behind finding the best location for a solve, but <strong>if it's just not working for you</strong>, try
          temporarily marking a few cells as <strong>disabled</strong> to help force the solve into the location you think is best. This can help you work
          around grid constraints and focus on placing technologies where you'd see they'd fit better.
        </p>
      </article>
    </>
  );
};

export default React.memo(InstructionsContent);
