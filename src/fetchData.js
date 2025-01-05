const axios = require('axios');
require('dotenv').config();

async function fetchOdds(sport, market) {
  const API_KEY = process.env.API_KEY;

  try {
    const response = await axios.get(
      `https://api.the-odds-api.com/v4/sports/${sport}/odds`,
      {
        params: {
          apiKey: API_KEY,
          regions: 'us', // US odds only
          markets: market, // Market type (e.g., 'h2h' for moneylines)
          oddsFormat: 'american',
        },
      }
    );

    // Filter games that haven't started yet
    const now = Math.floor(Date.now() / 1000);
    const filteredData = response.data.filter(event => {
      const eventTime = Math.floor(new Date(event.commence_time).getTime() / 1000);
      return eventTime > now;
    });

    return filteredData; // Return filtered events
  } catch (error) {
    console.error('API Fetch Error:', error.message);
    throw error;
  }
}

module.exports = { fetchOdds };
