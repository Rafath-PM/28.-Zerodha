# IPO Pulse - 3-Year IPO Performance Tracker

A premium, responsive, mobile-first Web/PWA application built to track and analyze the listing and current performance of major Indian Mainboard IPOs over the past three years (May 2023 - May 2026).

---

## 🌟 Key Features

* **Desktop & Mobile Responsive Frame**: Renders as a beautiful, high-fidelity smartphone device on desktop and scales to fill screen real-estate natively on actual mobile viewports.
* **Core Analytics Dashboard**:
  * **Average Listing Gain/Loss** computed dynamically.
  * **Top Performing IPO** highlighting maximum debut gains.
  * **Under-performing IPO** tracking current lowest returns.
* **High-Fidelity Interaction**:
  * **Real-time Search**: Search by company name or stock exchange trading symbols.
  * **Year Filters**: Filter results instantly between **2023, 2024, 2025, and 2026**.
  * **Advanced Sorting**: Sort stocks by listing dates, listing day gains, current returns, or alphabetical order.
  * **Slide-up Detail Drawer**: Click any stock card to trigger a smooth, mobile-style slide-up drawer showing:
    * Detailed company descriptions (what the company does).
    * Pricing summary table (Offer price vs Debut price vs Current market price).
    * Visual performance gauge comparing downside risks vs upside gains.

---

## 🛠️ Technology Stack

* **Structure**: Semantic HTML5
* **Logic**: Vanilla ES6+ Javascript (no heavy frameworks, zero runtime bundle size)
* **Styling**: Vanilla CSS3 custom properties with glassmorphism, responsive grid layouts, and hardware-accelerated animations.
* **Icons & Fonts**: Google Fonts (Outfit & Inter), FontAwesome Icons.

---

## 🚀 How to Run Locally

### Option 1: Direct File Execution
You can simply locate and double-click `index.html` on your computer, or drag-and-drop it into any modern web browser (Chrome, Safari, Firefox, Edge).

### Option 2: Live Local Server (Recommended)
To run it on a local development server:

#### Using Python (Built-in)
Run the following command in your terminal inside the project directory:
```bash
python3 -m http.server 8000
```
Then visit: `http://localhost:8000`

#### Using Node/Npx
Alternatively, run:
```bash
npx serve .
```
Then visit the URL shown in your console.
