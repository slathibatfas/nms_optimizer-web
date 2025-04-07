## CI/CD Status

![Tests](https://github.com/jbelew/nms_optimizer-web/actions/workflows/main.yml/badge.svg?branch=main)
![Deployment](https://img.shields.io/badge/Deployment-Heroku-blue?logo=heroku)

**Web UI for No Man's Sky Starship Layout Optimization**

This tool optimizes starship layouts by calculating pattern-based scores. It prioritizes supercharged slots using game-tested configurations and ensures the best fit within the grid. When additional supercharged slots are in range of a pattern, the tool runs a localized brute-force solve to explore layouts outside of the base configurations that offer additional benefits. The goal is not to calculate in-game stats but to use a thoroughly tested weighting system for layout optimization.

[Live Instance](https://nms-optimizer-web-ac700a458f0a.herokuapp.com/)

![Screenshot](https://github.com/jbelew/nms_optimizer-web/blob/main/public/assets/img/screenshot.png?raw=true)

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
   git clone https://github.com/jbelew/nms_optimizer-web.git
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
