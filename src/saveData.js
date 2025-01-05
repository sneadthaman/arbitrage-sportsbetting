// saveData.js - Save Data to Database
const db = require('./db');

function saveOdds(data) {
  data.forEach(event => {
    const commenceTime = new Date(event.commence_time).toISOString(); // Ensure ISO format
    event.bookmakers.forEach(bookmaker => {
      bookmaker.markets.forEach(market => {
        market.outcomes.forEach(outcome => {
          db.run(
            `INSERT INTO odds (sportsbook, event_id, team_name, odds, commence_time)
             VALUES (?, ?, ?, ?, ?)`,
            [
              bookmaker.key,           // Sportsbook name
              event.id,                // Event ID
              outcome.name,            // Team name
              outcome.price,           // Odds
              commenceTime             // Event start time
            ],
            (err) => {
              if (err) {
                console.error('Insert Error:', err.message);
              } else {
                console.log(`Saved odds for ${outcome.name} at ${bookmaker.key}`);
              }
            }
          );
        });
      });
    });
  });
}

module.exports = { saveOdds };