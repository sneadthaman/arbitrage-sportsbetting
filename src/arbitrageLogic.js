// arbitrageLogic.js - Arbitrage Calculation

function americanToDecimal(odds) {
    if (odds > 0) {
      return 1 + odds / 100;
    } else {
      return 1 + 100 / Math.abs(odds);
    }
  }
  
  function findArbitrage(oddsData, cutoff = 0.02) { // 2% profit cutoff
    const opportunities = [];
  
    // Group data by event ID
    const groupedEvents = oddsData.reduce((acc, row) => {
      if (!acc[row.event_id]) acc[row.event_id] = [];
      acc[row.event_id].push(row);
      return acc;
    }, {});
  
    Object.keys(groupedEvents).forEach(eventId => {
      const event = groupedEvents[eventId];
  
      // Find the best odds for each outcome
      const bestOdds = {};
      let commenceTime = null;
  
      event.forEach(row => {
        console.log('Row Commence Time:', row.commence_time); // Debug log
        if (!bestOdds[row.team_name] || row.odds > bestOdds[row.team_name].odds) {
          bestOdds[row.team_name] = { ...row };
        }
        // Capture commence_time
        if (!commenceTime && row.commence_time) {
          commenceTime = row.commence_time; // Use first valid commence_time
        }
      });
  
      // Calculate total implied odds
      const totalImpliedOdds = Object.values(bestOdds).reduce((sum, outcome) => {
        const decimalOdds = americanToDecimal(outcome.odds); // Convert odds to decimal
        console.log('Decimal Odds:', decimalOdds); // Debug conversion
        console.log('Implied Probability:', 1 / decimalOdds); // Debug probabilities
        return sum + (1 / decimalOdds); // Implied probability
      }, 0);
  
      console.log('Total Implied Odds:', totalImpliedOdds); // Debug total probabilities
  
      // Check for arbitrage
      if (totalImpliedOdds < (1 - cutoff)) {
        console.log('Arbitrage Found for Event:', eventId); // Debug arbitrage
        console.log('Profit:', ((1 - totalImpliedOdds) * 100).toFixed(2) + '%');
        opportunities.push({
          event_id: eventId,
          commence_time: commenceTime, // Include commence_time
          outcomes: bestOdds,
          profit: ((1 - totalImpliedOdds) * 100).toFixed(2) + '%'
        });
      } else {
        console.log('No Arbitrage for Event:', eventId); // Debug no arbitrage
        console.log('Total Implied Odds:', totalImpliedOdds);
      }
    });
  
    return opportunities;
  }
  
  module.exports = { findArbitrage };
  