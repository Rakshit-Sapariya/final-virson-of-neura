# Neura AI — Final Version (Frontend)

> An intelligence layer for voice, code, vision, and reasoning — built for builders and creators.

![Neura AI Banner](public/favicon.ico)

## 🌟 Overview

**Neura AI** is a state-of-the-art multimodal AI assistant frontend built with **React 19**, **TanStack Start**, **TanStack Router**, **Tailwind CSS**, and **Framer Motion**. It combines the reasoning power of frontier models with the speed of global Edge LPUs and private on-device WebGPU inference.

---

## 🚀 Key Features

### 1. 5 Modular Dedicated Pages
- **🏠 Overview (`/`)**: Interactive Living Neural Core with real-time audio waveforms, telemetry metrics, social proof, and ecosystem navigation cards.
- **⚡ Capabilities (`/features`)**: Dual-engine duplex speech, live side-by-side code execution canvas, autonomous vector memory, and WebGPU acceleration.
- **🧠 Model Mesh (`/models`)**: Real-time intent routing between **Nemotron 3 Ultra 550B**, **Claude 3.7 Sonnet**, **Gemini 2.5 Flash 1M**, and **Groq Llama 3.3**, plus latency speed benchmarks.
- **🔌 Integrations (`/integrations`)**: 15+ developer tools, databases, and cloud connectors (GitHub, VS Code, Supabase, Docker, Slack, Redis, Discord, AWS) with interactive code snippets.
- **💳 Pricing & Plans (`/pricing`)**: Interactive workload slider, Free Explorer tier ($0), Neura Pro ($12/mo) with instant checkout modal, and Enterprise consultation dialog.

### 2. Neura Intelligence Workspace (`/app`)
- **ChatGPT & Claude Hybrid UX**: Reasoning disclosure accordions, message editing, code copy, and prompt enhancement.
- **Split-Screen Interactive Canvas**: Run code, preview React components, and execute actions with instant AST verification.
- **Multi-Model Intent Router**: Seamlessly switch between frontier models without losing chat memory or context.
- **File Attachments**: Upload documents, source code, and images with automatic token counting and badge management.

### 3. Sleek Floating Bottom Island
- Desktop and mobile-optimized floating navigation dock with instant **Sign In** and **Launch AI** access on every single page.
- Smooth upward-opening mobile navigation drawer.

---

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- **UI Library**: React 19 + Tailwind CSS + Framer Motion
- **Icons**: Lucide React + React Icons (Heroicons, Simple Icons)
- **Local Inference**: WebGPU MLCEngine (Qwen / Llama 596M parameters)
- **Package Manager**: pnpm

---

## 📦 Getting Started

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone https://github.com/Rakshit-Sapariya/final-virson-of-neura.git
cd final-virson-of-neura

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build

```bash
pnpm run build
pnpm run preview
```

---

## 📄 License

MIT License © 2026 Rakshit Sapariya. All rights reserved.
