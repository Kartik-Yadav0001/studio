# Thread Weaver

A dynamic, real-time thread pool simulator for visualizing high-performance computing concepts.

[![CI](https://github.com/Kartik-Yadav0001/studio/actions/workflows/ci.yml/badge.svg)](https://github.com/Kartik-Yadav0001/studio/actions/workflows/ci.yml)

**[Live Demo](https://your-live-demo-url-here.com)**

Thread Weaver provides an interactive dashboard to simulate and visualize the behavior of a multi-threaded application. It helps in understanding complex concepts like workload distribution, mutex locks, thread synchronization, and performance optimization in a visual and intuitive way.

## Screenshots

*(Add screenshots of the application dashboard here)*

![Thread Weaver Dashboard](https://placehold.co/800x400?text=App+Screenshot+Placeholder)

## Features

- **Dynamic Thread Pool:** Adjust the number of threads in real-time and watch the simulation adapt.
- **Workload Simulation:** Configure the number of tasks and shared resources to simulate different workload profiles.
- **Real-time Monitoring:** A live-updating dashboard visualizes thread activity, resource utilization, and overall system performance.
- **AI Performance Analyst:** An integrated AI agent analyzes the simulation and provides intelligent recommendations for optimizing the thread count.
- **Event Log:** A detailed log streams all significant events, from task completion to resource locking.
- **Graceful Scaling:** Threads are gracefully created and terminated to reflect real-world thread pool management.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative:** [Google Genkit](https://firebase.google.com/docs/genkit) (with Gemini)
- **Code Quality:** ESLint, Prettier
- **CI/CD:** GitHub Actions

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Kartik-Yadav0001/studio.git
    cd studio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project. You can copy the example if one exists.
    ```bash
    touch .env
    ```
    You will need to add your API key for the Gemini model to enable the AI Performance Analyst feature.
    ```
    GEMINI_API_KEY="your_google_ai_api_key"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.
