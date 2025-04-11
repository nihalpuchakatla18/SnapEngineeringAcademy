/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

const FRESH_PRINCE_URL =
  "https://upload.wikimedia.org/wikipedia/en/3/33/Fresh_Prince_S1_DVD.jpg";
const CURB_POSTER_URL =
  "https://m.media-amazon.com/images/M/MV5BZDY1ZGM4OGItMWMyNS00MDAyLWE2Y2MtZTFhMTU0MGI5ZDFlXkEyXkFqcGdeQXVyMDc5ODIzMw@@._V1_FMjpg_UX1000_.jpg";
const EAST_LOS_HIGH_POSTER_URL =
  "https://static.wikia.nocookie.net/hulu/images/6/64/East_Los_High.jpg";

// Array of TV show titles
let titles = [
  "Fresh Prince of Bel Air",
  "Curb Your Enthusiasm",
  "East Los High"
];

// Array to store all games
let games = [];
let filteredGames = [];

// Function to fetch and parse CSV data
async function loadGamesFromCSV() {
  try {
    const response = await fetch('games.csv');
    const csvText = await response.text();
    const rows = csvText.split('\n');
    
    // Skip header row and process each data row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (row) {  // Skip empty rows
        const [title, platform, year, genre, publisher, globalSales, imageURL] = row.split(',');
        games.push({
          title: title,
          platform: platform,
          year: parseInt(year),
          genre: genre,
          publisher: publisher,
          globalSales: parseFloat(globalSales),
          imageURL: imageURL
        });
      }
    }
    filteredGames = [...games];
    showCards();
    setupSearch();
  } catch (error) {
    console.error('Error loading CSV:', error);
  }
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchCategory = document.getElementById('searchCategory');

  // Add event listeners for both input changes and category changes
  searchInput.addEventListener('input', performSearch);
  searchCategory.addEventListener('change', performSearch);
}

function performSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchCategory = document.getElementById('searchCategory');
  const searchTerm = searchInput.value.toLowerCase();
  const category = searchCategory.value;

  filteredGames = games.filter(game => {
    if (category === 'all') {
      return game.title.toLowerCase().includes(searchTerm) ||
             game.platform.toLowerCase().includes(searchTerm) ||
             game.genre.toLowerCase().includes(searchTerm) ||
             game.publisher.toLowerCase().includes(searchTerm);
    } else {
      return game[category].toLowerCase().includes(searchTerm);
    }
  });

  showCards();
}

function showCards() {
  const cardContainer = document.getElementById("card-container");
  if (!cardContainer) {
    console.error("Could not find card container");
    return;
  }

  // Get the template card
  const templateCard = cardContainer.querySelector(".card");
  if (!templateCard) {
    console.error("Could not find template card");
    return;
  }

  // Clear container except for the template
  while (cardContainer.children.length > 1) {
    cardContainer.removeChild(cardContainer.lastChild);
  }

  // Show message if no games found
  if (filteredGames.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.textContent = 'No games found matching your search.';
    cardContainer.appendChild(noResults);
    return;
  }

  // Create cards for each game
  for (const game of filteredGames) {
    const nextCard = templateCard.cloneNode(true);
    editCardContent(nextCard, game);
    cardContainer.appendChild(nextCard);
  }
}

function editCardContent(card, game) {
  if (!card) return;
  
  card.style.display = "block";

  const cardHeader = card.querySelector("h2");
  if (cardHeader) {
    cardHeader.textContent = game.title;
  }

  const cardImage = card.querySelector("img");
  if (cardImage) {
    // Try to load the game's image, fallback to placeholder if it fails
    cardImage.onerror = () => {
      cardImage.src = `https://via.placeholder.com/300x400?text=${encodeURIComponent(game.title)}`;
    };
    cardImage.src = game.imageURL;
    cardImage.alt = game.title + " Cover";
  }

  const cardDetails = card.querySelector(".card-details");
  if (cardDetails) {
    cardDetails.innerHTML = `
      <p><strong>Platform:</strong> ${game.platform}</p>
      <p><strong>Year:</strong> ${game.year}</p>
      <p><strong>Genre:</strong> ${game.genre}</p>
      <p><strong>Publisher:</strong> ${game.publisher}</p>
      <p><strong>Global Sales:</strong> ${game.globalSales}M</p>
    `;
  }
}

// Sorting functions
function sortByYear() {
  filteredGames.sort((a, b) => b.year - a.year);
  showCards();
}

function sortBySales() {
  filteredGames.sort((a, b) => b.globalSales - a.globalSales);
  showCards();
}

// Initialize the page when it loads
document.addEventListener("DOMContentLoaded", loadGamesFromCSV);

function quoteAlert() {
  console.log("Button Clicked!");
  alert(
    "I guess I can kiss heaven goodbye, because it got to be a sin to look this good!"
  );
}

function removeLastCard() {
  titles.pop(); // Remove last item in titles array
  showCards(); // Call showCards again to refresh
}
