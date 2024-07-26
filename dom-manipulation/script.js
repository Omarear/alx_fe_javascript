document.addEventListener('DOMContentLoaded', () => {
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspirational" },
    { text: "The way to get started is to quit talking and begin doing.", category: "Motivational" },
    { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const categoryFilter = document.getElementById('categoryFilter');
  const exportQuotesButton = document.getElementById('exportQuotes');

  // Function to show a random quote based on the current filter
  function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
  }

  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      localStorage.setItem('quotes', JSON.stringify(quotes));
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      populateCategoryFilter();
      alert('New quote added successfully!');
    } else {
      alert('Please enter both quote text and category.');
    }
  }

  // Function to export quotes to JSON file
  function exportQuotes() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const dataUrl = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'quotes.json';
    link.click();
  }

  // Function to import quotes from JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      localStorage.setItem('quotes', JSON.stringify(quotes));
      populateCategoryFilter();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // Function to populate the category filter dropdown
  function populateCategoryFilter() {
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
    const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;
  }

  // Function to filter quotes based on the selected category
  function filterQuotes() {
    localStorage.setItem('selectedCategory', categoryFilter.value);
    showRandomQuote();
  }

  // Event listener for the 'Show New Quote' button
  newQuoteButton.addEventListener('click', showRandomQuote);

  // Event listener for the 'Export Quotes' button
  exportQuotesButton.addEventListener('click', exportQuotes);

  // Attach addQuote and importFromJsonFile functions to the global window object
  window.addQuote = addQuote;
  window.importFromJsonFile = importFromJsonFile;

  // Populate the category filter and show a random quote on page load
  populateCategoryFilter();
  const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
  if (lastQuote) {
    quoteDisplay.textContent = `"${lastQuote.text}" - ${lastQuote.category}`;
  } else {
    showRandomQuote();
  }
});
