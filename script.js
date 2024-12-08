const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
const paginationContainer = document.getElementById('pagination');

const apiURL = 'https://api.lyrics.ovh';

// Function to search songs
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();
  displaySongs(data);
}

// Function to display songs
function displaySongs(data) {
  resultsContainer.innerHTML = data.data
    .map(
      song => `
    <div class="song">
      <strong>${song.artist.name}</strong> - ${song.title}
      <button class="get-lyrics" data-artist="${song.artist.name}" data-song="${song.title}">Get Lyrics</button>
    </div>
  `
    )
    .join('');

  displayPagination(data);
}

// Function to display pagination
function displayPagination(data) {
  paginationContainer.innerHTML = '';
  if (data.prev || data.next) {
    if (data.prev) {
      const prevBtn = document.createElement('button');
      prevBtn.innerText = 'Prev';
      prevBtn.onclick = () => getMoreSongs(data.prev);
      paginationContainer.appendChild(prevBtn);
    }

    if (data.next) {
      const nextBtn = document.createElement('button');
      nextBtn.innerText = 'Next';
      nextBtn.onclick = () => getMoreSongs(data.next);
      paginationContainer.appendChild(nextBtn);
    }
  }
}

// Function to get more songs (pagination)
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  displaySongs(data);
}

// Function to get lyrics
async function getLyrics(artist, song) {
  const res = await fetch(`${apiURL}/v1/${artist}/${song}`);
  const data = await res.json();
  resultsContainer.innerHTML = `
    <h2><strong>${artist}</strong> - ${song}</h2>
    <p>${data.lyrics ? data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>') : 'No lyrics found'}</p>
    <button onclick="searchSongs('${searchInput.value}')">Back</button>
  `;
}

// Event listener for search
searchBtn.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    searchSongs(searchTerm);
  }
});

// Event listener for "Get Lyrics" buttons
resultsContainer.addEventListener('click', e => {
  if (e.target.classList.contains('get-lyrics')) {
    const artist = e.target.getAttribute('data-artist');
    const song = e.target.getAttribute('data-song');
    getLyrics(artist, song);
  }
});
