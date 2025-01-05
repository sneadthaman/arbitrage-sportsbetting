const express = require('express');
const path = require('path');
const db = require('./db');
const { fetchOdds } = require('./fetchData');
const { saveOdds } = require('./saveData');
const { findArbitrage } = require('./arbitrageLogic');

const app = express();
const PORT = process.env.PORT || 5002;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Root route serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fetch odds data and save to database
app.get('/odds/moneyline', async (req, res) => {
  try {
    const data = await fetchOdds('basketball_ncaab', 'h2h'); // Money lines
    saveOdds(data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching odds:', error.message);
    res.status(500).send('Error fetching odds');
  }
});

// Analyze arbitrage opportunities
app.get('/arbitrage/moneyline', async (req, res) => {
  db.all(`SELECT * FROM odds`, (err, rows) => {
    if (err) {
      console.error('Database Error:', err.message);
      return res.status(500).send('Error fetching data');
    }

    console.log('Fetched Rows:', rows); // Debug rows fetched
    const opportunities = findArbitrage(rows, 0.02); // Use 2% cutoff

    console.log('Final Opportunities:', opportunities); // Debug output
    res.json(opportunities); // Return opportunities
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
