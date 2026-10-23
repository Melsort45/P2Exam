//por si falta el sprite se usa un placeholder
const DEFAULT_IMAGE = "data:image/svg+xml;utf8," + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="100%" height="100%" fill="#2b3035"/>
    <circle cx="100" cy="100" r="60" fill="none" stroke="#6c757d" stroke-width="8"/>
    <line x1="40" y1="100" x2="160" y2="100" stroke="#6c757d" stroke-width="8"/>
    <circle cx="100" cy="100" r="18" fill="#2b3035" stroke="#6c757d" stroke-width="8"/>
    <text x="50%" y="185" font-family="sans-serif" font-size="14" fill="#adb5bd" text-anchor="middle">Sin Imagen</text>
  </svg>
`);

const loadingSpinner = document.getElementById('loading-spinner');
const errorView = document.getElementById('error-view');
const errorMessage = document.getElementById('error-message');
const catalogSection = document.getElementById('catalog-section');

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const errorResetBtn = document.getElementById('error-reset-btn');
const brandReset = document.getElementById('brand-reset');

// cosas de pokemon
const pokemonName = document.getElementById('pokemon-name');
const pokemonId = document.getElementById('pokemon-id');
const pokemonImg = document.getElementById('pokemon-img');
const pokemonTypes = document.getElementById('pokemon-types');
const pokemonExp = document.getElementById('pokemon-exp');
const pokemonHeight = document.getElementById('pokemon-height');
const pokemonWeight = document.getElementById('pokemon-weight');
const pokemonAbilities = document.getElementById('pokemon-abilities');
const pokemonMoves = document.getElementById('pokemon-moves');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// navegacion controles
let currentPrevId = null;
let currentNextId = null;

//busca en el backend y carga los datos en la UI
async function loadPokemon(identifier = '') {
  showLoading(true);
  hideError();

  try {
    const endpoint = identifier ? `/api/pokemon/${encodeURIComponent(identifier)}` : '/api/pokemon';
    const response = await fetch(endpoint);

    if (response.status === 404) {
      showError(`El Pokémon "${identifier}" no fue encontrado. Intenta buscar otro.`);
      return;
    }

    if (!response.ok) {
      throw new Error(`Servidor respondió con estado ${response.status}`);
    }

    const pokemon = await response.json();
    renderPokemonDetail(pokemon);
  } catch (err) {
    showError(`Error de conexión con el servidor: ${err.message}`);
  } finally {
    showLoading(false);
  }
}

//muestra los datos en la UI
function renderPokemonDetail(pokemon) {
  catalogSection.classList.remove('d-none');

  pokemonName.textContent = pokemon.name || 'Desconocido';
  pokemonId.textContent = pokemon.id ? `#${String(pokemon.id).padStart(3, '0')}` : '#???';

  pokemonImg.src = pokemon.image || DEFAULT_IMAGE;
  pokemonImg.onerror = () => { pokemonImg.onerror = null; pokemonImg.src = DEFAULT_IMAGE; };

  pokemonExp.textContent = pokemon.experience ?? '-';
  pokemonHeight.textContent = pokemon.height ?? '-';
  pokemonWeight.textContent = pokemon.weight ?? '-';

  //tipos
  pokemonTypes.innerHTML = '';
  (pokemon.types || []).forEach((type) => {
    const badge = document.createElement('span');
    badge.className = 'badge bg-danger text-uppercase px-3 py-2';
    badge.textContent = type;
    pokemonTypes.appendChild(badge);
  });

  //habilidades
  pokemonAbilities.innerHTML = '';
  (pokemon.abilities || []).forEach((ability) => {
    const badge = document.createElement('span');
    badge.className = 'badge bg-secondary text-capitalize me-1 mb-1';
    badge.textContent = ability;
    pokemonAbilities.appendChild(badge);
  });

  //movimientos
  pokemonMoves.innerHTML = '';
  const moves = pokemon.moves || [];
  if (moves.length === 0) {
    pokemonMoves.innerHTML = '<span class="text-secondary small">Sin movimientos</span>';
  } else {
    moves.slice(0, 15).forEach((move) => {
      const badge = document.createElement('span');
      badge.className = 'badge border border-secondary text-body-secondary text-capitalize me-1 mb-1';
      badge.textContent = move;
      pokemonMoves.appendChild(badge);
    });
  }

  //guarda ID para navegación
  currentPrevId = pokemon.prevId;
  currentNextId = pokemon.nextId;

  prevBtn.disabled = currentPrevId === null;
  nextBtn.disabled = currentNextId === null;
}

//botones anterior y siguiente
prevBtn.addEventListener('click', () => {
  if (currentPrevId !== null) loadPokemon(currentPrevId);
});

nextBtn.addEventListener('click', () => {
  if (currentNextId !== null) loadPokemon(currentNextId);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && currentPrevId !== null) {
    loadPokemon(currentPrevId);
  } else if (e.key === 'ArrowRight' && currentNextId !== null) {
    loadPokemon(currentNextId);
  }
});

//buscar
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    clearSearchBtn.classList.remove('d-none');
    loadPokemon(query);
  } else {
    resetToDefault();
  }
});

function resetToDefault() {
  searchInput.value = '';
  clearSearchBtn.classList.add('d-none');
  loadPokemon();
}

clearSearchBtn.addEventListener('click', resetToDefault);
errorResetBtn.addEventListener('click', resetToDefault);
brandReset.addEventListener('click', (e) => {
  e.preventDefault();
  resetToDefault();
});

//mostrar spinner cuando cargando y ocultar catalogo, mostrar error si hay error
function showLoading(isLoading) {
  loadingSpinner.classList.toggle('d-none', !isLoading);
  if (isLoading) catalogSection.classList.add('d-none');
}

function showError(msg) {
  catalogSection.classList.add('d-none');
  errorMessage.textContent = msg;
  errorView.classList.remove('d-none');
}

function hideError() {
  errorView.classList.add('d-none');
}

//cargar 1er pokemon al iniciar la app
document.addEventListener('DOMContentLoaded', () => loadPokemon());