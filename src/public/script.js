// script.js - Client-side JavaScript for Arbitrage Dashboard

async function fetchArbitrageData() {
  try {
    const response = await fetch('http://localhost:5002/arbitrage/moneyline');
    const data = await response.json();
    const tableBody = document.getElementById('opportunities-body');
    tableBody.innerHTML = '';

    data.forEach(opportunity => {
      const row = document.createElement('tr');

      // Event ID and Team Names
      const teams = Object.keys(opportunity.outcomes);
      const eventCell = document.createElement('td');
      eventCell.textContent = `${teams[0]} vs ${teams[1]}`;
      row.appendChild(eventCell);

      // Commence Time Column
      const eventTimeCell = document.createElement('td');
      const startTime = new Date(opportunity.commence_time);
      eventTimeCell.textContent = startTime.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      row.appendChild(eventTimeCell);

      // Home Odds
      const homeCell = document.createElement('td');
      homeCell.textContent = `${opportunity.outcomes[teams[0]].odds} (${opportunity.outcomes[teams[0]].sportsbook})`;
      row.appendChild(homeCell);

      // Away Odds
      const awayCell = document.createElement('td');
      awayCell.textContent = `${opportunity.outcomes[teams[1]].odds} (${opportunity.outcomes[teams[1]].sportsbook})`;
      row.appendChild(awayCell);

      // Profit Percentage
      const profitCell = document.createElement('td');
      profitCell.textContent = opportunity.profit;
      profitCell.style.color = 'green';
      row.appendChild(profitCell);

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching arbitrage data:', error);
  }
}

// Fetch data when page loads
fetchArbitrageData();
