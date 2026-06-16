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

  const MIN_QUERY_LENGTH = 2;
  let debounceTimer;
  let filteredPosts = [];

  function filterPosts(query) {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery === '') {
      return [...searchData];
    }

    return searchData.filter(post => {
      const title = post.title.toLowerCase();
      const content = (post.content || '').toLowerCase();

      return title.includes(lowerQuery) || content.includes(lowerQuery);
    });
  }

  function renderPosts(posts, query) {
    searchResults.innerHTML = '';

    if (query.length < MIN_QUERY_LENGTH) {
      searchResults.style.display = 'none';
      return;
    }

    if (posts.length === 0) {
      searchResults.innerHTML = '<div class="no-results">Sonuç bulunamadı :(</div>';
      searchResults.style.display = 'block';
      return;
    }

    searchResults.style.display = 'block';
    searchResults.innerHTML = `<div class="search-info">${posts.length} sonuç bulundu</div>`;

    posts.forEach(post => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = `
        <a href="${post.url}">
          <h3>${post.title}</h3>
          <p class="snippet">${post.snippet || ''}</p>
        </a>
      `;
      searchResults.appendChild(div);
    });
  }

  function handleSearch() {
    const query = searchInput.value.trim();
    filteredPosts = filterPosts(query);

    if (query === '') {
      resultCount.style.display = 'none';
    } else {
      resultCount.textContent = `${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''} found`;
      resultCount.style.display = 'inline-block';
    }

    renderPosts(filteredPosts, query);
  }

  const resultCount = document.createElement('div');
  resultCount.id = 'search-result-count';
  resultCount.style.display = 'none';
  resultCount.style.marginTop = '10px';
  resultCount.style.fontSize = '14px';
  resultCount.style.color = '#0066cc';
  searchResults.parentNode.insertBefore(resultCount, searchResults);

  searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      handleSearch();
    }, 150);
  });

  searchButton && searchButton.addEventListener('click', function(e) {
    e.preventDefault();
    clearTimeout(debounceTimer);
    handleSearch();
  });

  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(debounceTimer);
      handleSearch();
    }
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('#search-input') && !e.target.closest('#search-results')) {
      searchResults.style.display = 'none';
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchResults.style.display = 'none';
      searchInput.value = '';
      resultCount.style.display = 'none';
    }
  });
});
