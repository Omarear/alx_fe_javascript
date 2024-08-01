const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Using JSONPlaceholder for simulation
const SYNC_INTERVAL = 5000; // 5 seconds interval for data sync

// Array of quote objects (initial data)
let quotes = [
  { id: 1, text: "The best way to predict the future is to create it.", category: "Inspiration" },
  { id: 2, text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { id: 3, text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Motivation" }
];

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();
    return serverQuotes.map((quote, index) => ({
      id: index + 1,
      text: quote.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// Function to sync local quotes with server quotes
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const serverQuoteIds = new Set(serverQuotes.map(quote => quote.id));

  // Merge server quotes into local quotes
  quotes = quotes.filter(quote => !serverQuoteIds.has(quote.id)).concat(serverQuotes);

  // Notify user about the sync
  notifyUser("Quotes synced with server!");
  
  // Update the category filter dropdown
  populateCategories();

  // Display a new random quote
  showRandomQuote();
}

// Function to send a new quote to the server
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });
    if (!response.ok) {
      throw new Error("Failed to send quote to the server.");
    }
  } catch (error) {
    console.error("Error sending quote to the server:", error);
  }
}

// Function to notify user about updates or conflicts
function notifyUser(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.backgroundColor = "lightyellow";
  notification.style.padding = "10px";
  notification.style.margin = "10px 0";
  document.body.insertBefore(notification, document.body.firstChild);
  setTimeout(() => notification.remove(), 5000);
}

// Function to show a random quote
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for the selected category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `${randomQuote.text} - ${randomQuote.category}`;
}

// Function to create and display the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById('addQuoteFormContainer');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Function to add a new quote
async function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      id: quotes.length + 1,
      text: newQuoteText,
      category: newQuoteCategory
    };
    quotes.push(newQuote);
    await sendQuoteToServer(newQuote); // Send the new quote to the server
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added successfully!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Function to dynamically populate the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category; // Using textContent to set the text of the option
    categoryFilter.appendChild(option);
  });
  // Restore last selected category filter from local storage
  const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = lastSelectedCategory;
}

// Function to get quotes based on the selected category
function getFilteredQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  if (selectedCategory === 'all') {
    return quotes;
  }
  return quotes.filter(quote => quote.category === selectedCategory);
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem('selectedCategory', selectedCategory);
  showRandomQuote();
}

// Add event listener to "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initial calls to display a random quote and create the add quote form on page load
createAddQuoteForm();
populateCategories();
filterQuotes();

// Periodically sync quotes with the server
setInterval(syncQuotes, SYNC_INTERVAL);
