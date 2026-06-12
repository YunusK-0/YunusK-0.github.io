// Arama fonksiyonu
let searchData = [];

// Arama verilerini yükle
async function loadSearchData() {
  try {
    const response = await fetch('/search.json');
    searchData = await response.json();
  } catch (error) {
    console.error('Arama verileri yüklenirken hata:', error);
  }
}

// Sayfada ara
function performSearch(query) {
  if (!query || query.length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  return searchData.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(lowerQuery);
    const contentMatch = item.content.toLowerCase().includes(lowerQuery);
    return titleMatch || contentMatch;
  }).map(item => {
    // İçerikten ilgili snippet al
    const content = item.content.toLowerCase();
    const index = content.indexOf(lowerQuery);
    const snippet = index > 0 
      ? '...' + item.content.substring(Math.max(0, index - 50), index + 100) + '...'
      : item.content.substring(0, 150) + '...';
    
    return {
      ...item,
      snippet: snippet
    };
  });
}

// Search input event listener
document.addEventListener('DOMContentLoaded', function() {
  loadSearchData();
  
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;
  
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    const results = performSearch(query);
    
    searchResults.innerHTML = '';
    
    if (query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="no-results">Sonuç bulunamadı</div>';
      searchResults.style.display = 'block';
      return;
    }
    
    searchResults.style.display = 'block';
    results.forEach(result => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = `
        <a href="${result.url}">
          <h3>${result.title}</h3>
          <p>${result.snippet}</p>
        </a>
      `;
      searchResults.appendChild(div);
    });
  });
  
  // Sayfada tıklandığında arama sonuçlarını kapat
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#search-input') && !e.target.closest('#search-results')) {
      searchResults.style.display = 'none';
    }
  });
});
