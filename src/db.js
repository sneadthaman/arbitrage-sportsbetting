const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('./odds.db', (err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create table for odds
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS odds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sportsbook TEXT,
    event_id TEXT,
    team_name TEXT,
    odds NUMERIC,
    total NUMERIC,
    over_under TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
