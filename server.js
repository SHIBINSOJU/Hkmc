const express = require('express');
const mongoose = require('mongoose');
const util = require('minecraft-server-util');
const path = require('path');
const axios = require('axios'); // NEW: Required for the "Online Now" fix

// IMPORT THE MODEL
const Player = require('./models/Player'); 

const app = express();
const PORT = 3000;

// 1. MongoDB Connection
  // CORRECT (Add 'musicBOT' after the slash):
mongoose.connect('mongodb+srv://shibinhussainmk_db_user:4XZujvl0OnCKhdN5@musicbot.3sydv1a.mongodb.net/musicBOT?retryWrites=true&w=majority&appName=musicBOT')
  
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Configuration
const SERVER_IP = '148.113.5.96'; 
const SERVER_PORT = 25566; 

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES

// 1. HOME PAGE
app.get('/', async (req, res) => {
    // Try to fetch real top killer from Database
    let leaderboard = await Player.find().sort({ kills: -1 }).limit(1);

    if (leaderboard.length === 0) {
        leaderboard = [
            { username: 'Rizx', kills: 154, hearts: 20 }, // Fallback/Fake data
        ];
    }

    try {
        const status = await util.status(SERVER_IP, SERVER_PORT);
        res.render('index', {
            page: 'home',
            online: true,
            players: status.players.online,
            max: status.players.max,
            version: status.version.name,
            leaderboard: leaderboard
        });
    } catch (error) {
        // If server is offline
        res.render('index', {
            page: 'home',
            online: false,
            players: 0,
            max: 0,
            version: 'N/A',
            leaderboard: leaderboard
        });
    }
});

// 2. STORE PAGE (Coming Soon)
app.get('/store', (req, res) => {
    res.render('coming-soon', { pageName: 'store', page: 'store' });
});

// 3. VOTE PAGE (Coming Soon)
app.get('/vote', (req, res) => {
    res.render('coming-soon', { pageName: 'vote', page: 'vote' });
});

// 4. LEADERBOARD + LIVE PLAYERS PAGE (UPDATED FIX)
app.get('/leaderboard', async (req, res) => {
    try {
        // A. Fetch Top Killers from Database (Sorted by kills)
        // This comes from your PLUGIN
        const dbPlayers = await Player.find().sort({ kills: -1 }).limit(50);

        // B. Fetch LIVE Status from Public API (Who is online right now?)
        // This uses Axios to bypass the server hiding player names
        let onlineList = []; 
        try {
            const response = await axios.get(`https://api.mcsrvstat.us/3/${SERVER_IP}:${SERVER_PORT}`);
            
            // Check if the API sent us a list of players
            if (response.data.online && response.data.players && response.data.players.list) {
                onlineList = response.data.players.list; 
            }
        } catch (e) {
            console.log("Could not fetch live players from API:", e.message);
        }

        res.render('leaderboard', { 
            page: 'leaderboard',
            players: dbPlayers,     // Database History (Red Table)
            livePlayers: onlineList // Real-time Online (Green Heads)
        });

    } catch (err) {
        console.error(err);
        res.send("Error loading leaderboard");
    }
});

// 5. DONATE PAGE
app.get('/donate', (req, res) => {
    const recentDonors = [
        { name: 'Zilsila', amount: '₹500' }, 
        { name: 'Shibinsoju', amount: '₹100' }
    ];

    res.render('donate', { 
        page: 'donate',
        donors: recentDonors
    });
});

// --- HELPER: Run this ONCE to generate fake data for testing ---
app.get('/seed-db', async (req, res) => {
    await Player.deleteMany({}); // Clear old data
    const names = ['Rizx', 'Viper', 'Shadow', 'Ghost', 'Titan', 'Neon', 'Ace', 'Luffy', 'Zoro', 'Sanji'];
    
    for(let i=0; i<20; i++) {
        await Player.create({
            username: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100),
            kills: Math.floor(Math.random() * 200),
            deaths: Math.floor(Math.random() * 50),
            hearts: Math.floor(Math.random() * 20) + 1,
            balance: Math.floor(Math.random() * 100000)
        });
    }
    res.send("✅ Database seeded with 20 fake players! Go to /leaderboard");
});

// --- TEMPORARY: Reset Database Route ---
app.get('/reset-stats', async (req, res) => {
    try {
        await Player.deleteMany({}); // This DELETES everyone from the database
        res.send("✅ Database Wiped! All fake players are gone. You can now restart your server to get real stats.");
    } catch (e) {
        res.send("Error wiping DB: " + e.message);
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 HKMC Website live at http://localhost:${PORT}`);
});
