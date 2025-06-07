import { Blockquote } from "@radix-ui/themes";
import React from "react";

const AboutContent: React.FC = () => {
  return (
    <article className="appDialog__body">
      <h1 className="appDialog__subheading">Overview</h1>
      <p className="appDialog__text">
        This web application provides an interactive interface for optimizing
        technology layouts in the game <em>No Man's Sky</em>, specifically for
        starships, multi-tools, and freighters. The tool focuses on identifying
        the <strong>best tech layouts</strong> by maximizing adjacency bonuses
        and leveraging supercharged slots—core strategies for achieving the{" "}
        <strong>best starship layout</strong>,{" "}
        <strong>best multi-tool layout</strong>, or
        <strong> best freighter layout</strong>.
      </p>

      <h2 className="pb-2 appDialog__subheading">How It Works</h2>
      <Blockquote>
        How do you solve a problem with 479 million possible permutations in
        under 5 seconds?
      </Blockquote>
      <p className="pt-4 appDialog__text">
        The optimization process blends deterministic patterns with adaptive
        algorithms tailored to No Man's Sky technology module grids:
      </p>

      <ol className="appDialog__list">
        <li className="appDialog__listItem">
          <strong>Pattern-Based Pre-Solve:</strong> Begins with a curated
          library of hand-tested layout patterns, optimizing for maximum
          adjacency bonuses across different grid types.
        </li>
        <li className="appDialog__listItem">
          <strong>AI-Guided Placement (ML Inference):</strong> If a viable
          configuration includes supercharged slots, the tool invokes a
          TensorFlow model trained on 16,000+ grids to predict optimal
          placement.
        </li>
        <li className="appDialog__listItem">
          <strong>Simulated Annealing (Refinement):</strong> Refines the layout
          through stochastic search—swapping modules and shifting positions to
          boost adjacency scoring while avoiding local optima.
        </li>
        <li className="appDialog__listItem">
          <strong>Result Presentation:</strong> Outputs the highest-scoring
          configuration, including score breakdowns and visual layout
          recommendations for starships, multi-tools, and freighters.
        </li>
      </ol>

      <h2 className="appDialog__subheading">Features</h2>
      <ul className="appDialog__list">
        <li className="appDialog__listItem">
          <strong>Grid-Aware Solving:</strong> Accounts for supercharged and
          inactive slots when determining the{" "}
          <strong>best layout configuration</strong>.
        </li>
        <li className="appDialog__listItem">
          <strong>TensorFlow ML Inference:</strong> Predicts optimal technology
          placement based on historical grid data.
        </li>
        <li className="appDialog__listItem">
          <strong>Simulated Annealing:</strong> Improves layout quality by
          exploring configuration shifts and adjacency-based swaps.
        </li>
      </ul>

      <h2 className="appDialog__subheading">Tech Stack</h2>
      <p className="appDialog__text">
        <strong>Frontend:</strong> TypeScript, React, Zustand, Vite, Tailwind
        CSS, Radix UI.
        <br />
        <strong>Backend Solver:</strong> Python, Flask, TensorFlow, NumPy,
        custom simulated annealing implementation, and heuristic scoring.
        <br />
        <strong>Testing:</strong> Vitest, Python Unittest.
        <br />
        <strong>Deployment:</strong> Heroku (Hosting) and Cloudflare (DNS and
        CDN).
        <br />
        <strong>Automation:</strong> GitHub Actions (CI/CD).
        <br />
        <strong>Analytics:</strong> Google Analytics.
      </p>

      <h2 className="appDialog__subheading">Repositories</h2>
      <ul className="appDialog__list">
        <li className="appDialog__listItem">
          Web UI:{" "}
          <a
            href="https://github.com/jbelew/nms_optimizer-web"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            nms_optimizer-web
          </a>
        </li>
        <li className="appDialog__listItem">
          Backend:{" "}
          <a
            href="https://github.com/jbelew/nms_optimizer-service"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            nms_optimizer-service
          </a>
        </li>
      </ul>

      <h2 className="appDialog__subheading">Some Fun History</h2>
      <p className="appDialog__text">
        Here's a look at an <strong>early version</strong> of the
        UI—functionally solid but visually minimal. The current version is a
        major upgrade in design, usability, and clarity, helping players quickly
        find the <strong>best layout</strong> for any ship or tool.
      </p>
      <img
        src="/assets/img/screenshots/screenshot_v03.png"
        alt="Early prototype of No Man's Sky layout optimizer user interface"
        className="appDialog__screenshot"
      />
    </article>
  );
};

export default React.memo(AboutContent);
