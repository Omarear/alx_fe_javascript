document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
      { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspirational" },
      { text: "The way to get started is to quit talking and begin doing.", category: "Motivational" },
      { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
    ];
  
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    
    // Function to show a random quote
    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    }
  
    // Function to add a new quote
    function addQuote() {
      const newQuoteText = document.getElementById('newQuoteText').value;
      const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
      if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('New quote added successfully!');
      } else {
        alert('Please enter both quote text and category.');
      }
    }
  
    // Event listener for the 'Show New Quote' button
    newQuoteButton.addEventListener('click', showRandomQuote);
  
    // Attach addQuote function to the global window object so it can be called from HTML
    window.addQuote = addQuote;
    
    // Initial quote display
    showRandomQuote();
  });
  