<div align="center">

<a href="https://arc-web.github.io/sakay-na/">
  <img src="https://img.shields.io/badge/🎬_Interactive_Presentation-View_Live-7B2FBE?style=for-the-badge&labelColor=0F0F1A&color=7B2FBE" alt="View Interactive Presentation" />
</a>

</div>

---

<div align="center">

![](https://img.shields.io/badge/StellarPH_x_KMC-Claude_AI_Workshop-7B2FBE?style=for-the-badge)
![](https://img.shields.io/badge/Pod_B-4_Members-F5A623?style=for-the-badge)

# 🚐 Sakay Na! (Cebu Commuter Toolkit)

**An offline-first, dynamic jeepney route matching engine and AI-simulated gas price advisor for Cebuanos.**

</div>

---

## 📌 The Problem

Commuting in Cebu City can be daunting for newbies, students, and tourists. Knowing which jeepney numbers to ride (especially those requiring transfers) usually takes years of local knowledge. Additionally, vehicle owners constantly guess whether to fill up their tank today or wait for price drops. 

**Sakay Na!** solves both problems natively without needing to call expensive or rate-limited external APIs.

---

## ✨ Core Features

### 1. Offline Route Engine 📍
Say goodbye to unpredictable API wait times. We ingested a massive *Cebu Jeepney Route Cheat Sheet* and built a custom local-matching algorithm.
*   **Direct Matches**: Identifies single rides from Point A to Point B.
*   **Smart Transfers**: Detects multi-ride routes by bridging connections through major hubs (e.g., Colon, IT Park, Ayala).
*   **Landmark Aliases**: Connects colloquial locations (e.g., "Mabolo" = "SM City", "Capitol" = "Escario") directly to the rigid database rules.
*   **Instant Autocomplete**: Provides user suggestions as they type.

### 2. Gas Price Advisor ⛽
Simulates a localized financial advisor for vehicle owners to avoid price hikes.
*   Takes in **Current Tank Level** and **Daily Drive Distance**.
*   Outputs a deterministic, confident verdict (**"GAS UP NOW"** or **"YOU CAN WAIT"**).
*   Displays remaining range and trend predictions locally.

---

## 🛠 Tech Stack

*   **Frontend**: React + Vite
*   **Styling**: Pure CSS + Inline Styles with modern glassmorphic and gradient UI paradigms
*   **Typography**: *Azeret Mono* (technical data) & *Outfit* (headers)
*   **Matching Engine**: 100% Vanilla JavaScript algorithm powered by a localized `JEEPNEY_ROUTES` object array.

---

## 🚀 How to Run Locally

If you want to spin this up on your machine:

1. Expand the repository into your local disk.
2. Ensure you have Node.js installed.
3. Open a terminal and run the following commands:
   ```bash
   npm install
   npm run dev
   ```
4. Access the web application locally via `http://localhost:5173`.

---

*Built with ❤️ by Pod B during the KMC x StellarPH Claude AI Workshop.*
