// Arama fonksiyonu
let searchData = [];

// Arama verilerini yükle
async function loadSearchData() {
  try {
    const response = await fetch('/search.json');
    if (!response.ok) {
      throw new Error(`search.json yüklenemedi: ${response.status}`);
    }
    searchData = await response.json();
    console.log('Arama verileri yüklendi:', searchData.length, 'sayfa');
  } catch (error) {
    console.error('Arama verileri yüklenirken hata:', error);
  }
}

function buildSnippet(content, query) {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);

  if (index === -1) {
    return content.substring(0, 160).trim();
  }

  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + 110);
  let snippet = content.substring(start, end).trim();

  if (start > 0) {
    snippet = '... ' + snippet;
  }
  if (end < content.length) {
    snippet = snippet + ' ...';
  }

  return snippet;
}

function searchPages(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const results = searchData.reduce((acc, item) => {
    const title = item.title || '';
    const content = item.content || '';
    const titleMatch = title.toLowerCase().includes(lowerQuery);
    const contentMatch = content.toLowerCase().includes(lowerQuery);

    if (!titleMatch && !contentMatch) {
      return acc;
    }

    const matchCount = (content.toLowerCase().match(new RegExp(lowerQuery, 'g')) || []).length + (titleMatch ? 1 : 0);
    acc.push({
      ...item,
      snippet: buildSnippet(content, query),
      matchCount,
      isTitle: titleMatch
    });
    return acc;
  }, []);

  return results.sort((a, b) => {
    if (a.isTitle && !b.isTitle) return -1;
    if (!a.isTitle && b.isTitle) return 1;
    return b.matchCount - a.matchCount;
  });
}

// Search input event listener
document.addEventListener('DOMContentLoaded', async function() {
  await loadSearchData();

  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchResults = document.getElementById('search-results');

  if (!searchInput || !searchResults) return;

  const MIN_QUERY_LENGTH = 2;
  let debounceTimer;

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
          <p class="snippet">${post.snippet}</p>
        </a>
      `;
      searchResults.appendChild(div);
    });
  }

  const resultCount = document.createElement('div');
  resultCount.id = 'search-result-count';
  resultCount.style.display = 'none';
  resultCount.style.marginTop = '10px';
  resultCount.style.fontSize = '14px';
  resultCount.style.color = '#0066cc';
  searchResults.parentNode.insertBefore(resultCount, searchResults);

  function handleSearch() {
    const query = searchInput.value.trim();
    const posts = searchPages(query);

    if (query === '') {
      resultCount.style.display = 'none';
    } else {
      resultCount.textContent = `${posts.length} sonuç bulundu`;
      resultCount.style.display = 'inline-block';
    }

    renderPosts(posts, query);
  }

  searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(handleSearch, 150);
  });

  if (searchButton) {
    searchButton.addEventListener('click', function(e) {
      e.preventDefault();
      clearTimeout(debounceTimer);
      handleSearch();
    });
  }

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
