
# No Man's Sky Neural Technology Optimizer (Web UI)

## CI/CD Status

![Tests](https://github.com/jbelew/nms_optimizer-web/actions/workflows/main.yml/badge.svg?branch=main)
![Deployment](https://img.shields.io/badge/Deployment-Heroku-blue?logo=heroku)

**A Web UI for a No Man's Sky technology layout optimization tool**

This tool optimizes technology layouts by calculating pattern-based scores. It prioritizes supercharged slots using game-tested configurations and ensures the best fit within the grid. When additional supercharged slots are in range of a pattern, the tool runs a localized Simulated Annealing or ML-Driven solves to explore layouts outside of the base configurations that offer additional benefits. The goal is not to calculate in-game stats but to use a thoroughly tested weighting system for layout optimization.

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

The app will be available at `http://localhost:5173` by default. The app expects a service endpoint at http://127.0.0.1:5000/. Edit .env.development to set the service endpoint URL if you need to change the default value. 

---

### Docker compose.yml

```
version: "3.8"

services:
  backend:
    image: ghcr.io/jbelew/nms-optimizer-service:${TAG:-latest}
    container_name: nms-backend
    ports:
      - "${BACKEND_PORT}:${BACKEND_PORT}"
    environment:
      - PORT=2016
    restart: unless-stopped

  web:
    image: ghcr.io/jbelew/nms-optimizer-web:${TAG:-latest}
    container_name: nms-web
    ports:
      - "${WEB_PORT}:80"
    environment:
      - VITE_API_URL=http://backend:2016
    depends_on:
      - backend
    restart: unless-stopped
```

