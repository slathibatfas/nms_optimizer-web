Here's an updated version of your README with **local installation instructions** added:

---

**Web UI for No Man's Sky Starship Layout Optimization**

This tool optimizes starship layouts by calculating pattern-based scores. It prioritizes supercharged slots using game-tested configurations and ensures the best fit within the grid. When additional supercharged slots are in range of a pattern, the tool runs a localized brute-force solve to explore layouts outside of the base configurations that offer additional benefits. The goal is not to calculate in-game DPS but to use a thoroughly tested weighting system for layout optimization.

[Live Demo](https://nms-optimizer-web-ac700a458f0a.herokuapp.com/)

![Screenshot](https://github.com/jbelew/NMS_LayoutOptimizer/blob/master/screenshot.png?raw=true)

### **Tech Stack**
- **React**
- **Zustand**
- **Tailwind CSS**
- **Vite**
- **Radix UI**

The Python solver for this project can be found [here](https://github.com/jbelew/nms_optimizer-service).

---

### **Local Installation Instructions**

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone hhttps://github.com/jbelew/nms_optimizer-web
   cd nms_optimizer-web
   ```

2. **Install dependencies:**

   Make sure you have [Node.js](https://nodejs.org/) installed. Then, install the necessary dependencies with:

   ```sh
   npm install
   ```

3. **Run the development server:**

   Start the development server with:

   ```sh
   npm run dev
   ```

   The app will be available at `http://localhost:5173` by default.

If you want to also run the service locally, edit `src/constants.ts` and set the endpoints accordingly.
