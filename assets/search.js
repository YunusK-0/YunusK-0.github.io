// Arama fonksiyonu
let searchData = [];

// Arama verilerini yükle
async function loadSearchData() {
  try {
    const response = await fetch('/search.json');
    searchData = await response.json();
    console.log('Arama verileri yüklendi:', searchData.length, 'sayfa');
  } catch (error) {
    console.error('Arama verileri yüklenirken hata:', error);
  }
}

// Sayfada ara - tüm içeriği tarar
function performSearch(query) {
  if (!query || query.length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const results = [];

  searchData.forEach(item => {
    const titleMatch = item.title.toLowerCase().includes(lowerQuery);
    const contentLower = item.content.toLowerCase();
    const contentMatch = contentLower.includes(lowerQuery);
    
    if (titleMatch || contentMatch) {
      // İçerikten ilgili snippet al
      let snippet = '';
      let matchCount = 0;

      // Tüm eşleşmeleri bul
      const regex = new RegExp(`.{0,50}${lowerQuery}.{0,50}`, 'gi');
      const matches = item.content.match(regex);
      
      if (matches && matches.length > 0) {
        snippet = matches.slice(0, 3).join(' ... ');
        matchCount = (item.content.match(new RegExp(lowerQuery, 'gi')) || []).length;
      } else if (contentMatch) {
        const index = contentLower.indexOf(lowerQuery);
        snippet = item.content.substring(Math.max(0, index - 50), index + 150);
      } else {
        snippet = item.content.substring(0, 150);
      }

      results.push({
        ...item,
        snippet: snippet.trim(),
        matchCount: matchCount,
        isTitle: titleMatch
      });
    }
  });

  // Başlık eşleşenler önce gelsin, sonra eşleşme sayısına göre sırala
  return results.sort((a, b) => {
    if (a.isTitle && !b.isTitle) return -1;
    if (!a.isTitle && b.isTitle) return 1;
    return b.matchCount - a.matchCount;
  });
}

// Search input event listener
document.addEventListener('DOMContentLoaded', function() {
  loadSearchData();
  
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;
  
  function renderSearchResults(query) {
    const results = performSearch(query);
    searchResults.innerHTML = '';
    
    if (query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="no-results">Sonuç bulunamadı :(</div>';
      searchResults.style.display = 'block';
      return;
    }
    
    searchResults.style.display = 'block';
    searchResults.innerHTML = `<div class="search-info">${results.length} sonuç bulundu</div>`;
    
    results.forEach((result, index) => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = `
        <a href="${result.url}">
          <h3>${result.title}${result.isTitle ? ' ✓' : ''}</h3>
          <p class="snippet">${result.snippet}</p>
          ${result.matchCount > 0 ? `<small class="match-count">${result.matchCount} eşleşme</small>` : ''}
        </a>
      `;
      searchResults.appendChild(div);
    });
  }
  
  // Debounce fonksiyonu - performans için
  let searchTimeout;
  searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
      renderSearchResults(e.target.value.trim());
    }, 300); // 300ms bekle
  });

  if (searchButton) {
    searchButton.addEventListener('click', function() {
      renderSearchResults(searchInput.value.trim());
    });
  }

  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      renderSearchResults(searchInput.value.trim());
    }
  });
  
  // Sayfada tıklandığında arama sonuçlarını kapat
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#search-input') && !e.target.closest('#search-results')) {
      searchResults.style.display = 'none';
    }
  });
  
  // ESC tuşuna basınca kapat
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchResults.style.display = 'none';
      searchInput.value = '';
    }
  });
});
