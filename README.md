# 🌐 HKMC Stats Website

The official leaderboard and statistics dashboard for the **HKMC Minecraft Server**. This website connects directly to the server's MongoDB database to display real-time player stats, live online status, and player profiles.

**Live Demo:** [https://hkmc-stats.onrender.com](https://hkmc-stats.onrender.com) *(Replace with your actual link)*

## ✨ Features

* **🏆 Live Leaderboard:** Ranked list of top killers with custom badges for Top 3.
* **🟢 Real-Time Status:** Shows exactly who is online right now (synced via HKMCBridge).
* **🔍 Instant Search:** Filter players by name instantly without reloading.
* **💀 Advanced Stats:** Automatically calculates **K/D Ratio** (Kills/Deaths) and tracks Hearts.
* **👤 Player Profiles:** Dedicated pages for every player featuring:
    * 3D Skin Render (Interactive).
    * Personal Stats Breakdown.
    * Server Rank calculation.

## 🛠️ Technology Stack

* **Backend:** Node.js, Express.js
* **Frontend:** EJS (Embedded JavaScript), CSS3 (Glassmorphism UI)
* **Database:** MongoDB (Mongoose)
* **Hosting:** Render.com

## 🚀 Installation & Setup

If you want to run this website locally on your computer:

### 1. Prerequisites
* [Node.js](https://nodejs.org/) installed.
* Access to the HKMC MongoDB database.

### 2. Clone & Install
`
git clone [https://github.com/YourUsername/HKMC.git](https://github.com/YourUsername/HKMC.git)
cd HKMC
npm install`

### 3. Configuration
Open server.js and ensure your MongoDB connection string is correct:
`mongoose.connect('your_mongodb_connection_string_here')`

### 4. Run the Server
`node server.js`


The website will start at: http://localhost:3000
☁️ Deployment (Render)
This project is optimized for deployment on Render.com.
 * Create a Web Service on Render.
 * Connect this repository.
 * Build Command: npm install
 * Start Command: node server.js
 * Environment: Ensure you permit IP access in MongoDB Atlas (0.0.0.0/0) so Render can connect.
📂 Project Structure
 * server.js - Main application logic and routes.
 * models/Player.js - MongoDB Schema (defines how player data is saved).
 * views/ - EJS Templates (HTML pages).
   * leaderboard.ejs - The main stats page.
   * player.ejs - Individual profile page.
   * partials/ - Reusable Navbar and Footer.
 * public/ - Static assets (CSS, images).
👨‍💻 Developer
Built with ❤️ by ShotDevs
 * Founder: Shibin Hussain MK
 * Website: shotdevs.live
© 2026 HKMC Network. All Rights Reserved.
