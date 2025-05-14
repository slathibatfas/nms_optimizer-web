import { Blockquote } from "@radix-ui/themes";
import React from "react";

const AboutContent: React.FC = () => {
  return (
    <>
      <article className="appDialog__body">
        <h1 className="appDialog__subheading">Overview</h1>
        <p className="appDialog__text">
          This web application provides an interactive interface for optimizing technology layouts in the game <em>No Man's Sky</em>, specifically for starships
          and multi-tools. The tool focuses on module placement optimization, maximizing adjacency bonuses, and effectively utilizing supercharged slots to
          improve the overall grid layout.
        </p>

        <h2 className="pb-2 appDialog__subheading">How It Works</h2>
        <Blockquote>How do you solve a problem with 479 million possible permutations in under 5 seconds?</Blockquote> 
        <p className="pt-2 appDialog__text">
          The optimization process blends deterministic patterns with adaptive algorithms for No Man's Sky technology module grids:
        </p>

        <ol className="appDialog__list">
          <li className="appDialog__listItem">
            <strong>Pattern-Based Pre-Solve:</strong> Starts with a curated library of hand-tested layout patterns, optimizing grid placement for maximum
            adjacency bonuses.
          </li>
          <li className="appDialog__listItem">
            <strong>AI-Guided Placement (ML Inference):</strong> If the pattern fit find an "opportunity" window containing one or more supercharged slots, the
            tool invokes a TensorFlow model trained on 16k grid examples to predict optimal module placement.
          </li>
          <li className="appDialog__listItem">
            <strong>Simulated Annealing (Refinement):</strong> Refines the resulting layout through stochastic search, swapping modules and adjusting grid
            positions for further possible improved scoring while avoiding local optima.
          </li>
          <li className="appDialog__listItem">
            <strong>Result Presentation:</strong> The tool outputs the highest-scoring layout along with a detailed score breakdown and module placement
            recommendations.
          </li>
        </ol>

        <h2 className="appDialog__subheading">Features</h2>
        <ul className="appDialog__list">
          <li className="appDialog__listItem">
            <strong>Grid-Aware Solving:</strong> The tool accounts for supercharged and inactive slots when determining the best layout.
          </li>
          <li className="appDialog__listItem">
            <strong>TensorFlow ML Inference:</strong> Machine learning model predicts optimal layouts based on historical grid data.
          </li>
          <li className="appDialog__listItem">
            <strong>Simulated Annealing:</strong> Improves layout quality by exploring various configuration shifts and swapping modules.
          </li>
        </ul>

        <h2 className="appDialog__subheading">Tech Stack</h2>
        <p className="appDialog__text">
          <strong>Frontend:</strong> React, Zustand, Vite, Tailwind CSS, Radix UI.
          <br />
          <strong>Testing:</strong> Vitest, Python Unittest.
          <br />
          <strong>Backend Solver:</strong> Python, Flask, TensorFlow, NumPy, Simulated Annealing, Heuristic Scoring.
          <br />
          <strong>Deployment:</strong> Heroku (Hosting) and Cloudflare (DNS and CDN).
          <br />
          <strong>Automation:</strong> GitHub Actions (CI/CD).
          <br />
          <strong>Analytics:</strong> Google Analytics.
        </p>

        <h2 className="appDialog__subheading">Repositories</h2>
        <ul className="appDialog__list">
          <li className="appDialog__listItem">
            Web UI:{" "}
            <a href="https://github.com/jbelew/nms_optimizer-web" className="underline" target="_blank" rel="noopener noreferrer">
              nms_optimizer-web
            </a>
          </li>
          <li className="appDialog__listItem">
            Backend:{" "}
            <a href="https://github.com/jbelew/nms_optimizer-service" className="underline" target="_blank" rel="noopener noreferrer">
              nms_optimizer-service
            </a>
          </li>
        </ul>

        <h2 className="appDialog__subheading">Some Fun History</h2>
        <p className="appDialog__text">
          Here's a look at an <strong>early version</strong> of the UI—functionally solid but visually minimal. The current UI represents a significant upgrade
          in design, usability, and visual clarity.
        </p>
        <img
          src="/assets/img/screenshots/screenshot_v03.png"
          alt="Early version of the No Man's Sky technology layout optimization tool"
          className="appDialog__screenshot"
        />
      </article>
    </>
  );
};

export default React.memo(AboutContent);
