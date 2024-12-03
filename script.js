//sprites.other.home.front_default
async function fetchAllPokemons() {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    const response = await fetch(url);
    const result = await response.json();
    const pokemons = result.results
    for (const pokemon of pokemons) {
        pokemon.id = pokemon.url.split("/").at(-2);
        pokemon.imageSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
    }
    return pokemons;
};

function createCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    // card.classList.add('favorite');
    if (localStorage.getItem(pokemon.id) != null) {
        card.classList.add('favorite');
    };
    card.dataset.pokemonId = pokemon.id;
    const name = document.createElement('h3');
    name.classList.add('pokemon-name');
    name.textContent = pokemon.name;
    card.appendChild(name);
    const image = document.createElement('img');
    image.classList.add('pokemon-image');
    image.loading = 'lazy';
    image.alt = '';
    image.src = pokemon.imageSrc;
    card.appendChild(image);
    const pokemonId = document.createElement('p');
    pokemonId.classList.add('pokemon-id');
    pokemonId.textContent = '#' + pokemon.id.padStart(5, '0');
    card.appendChild(pokemonId);
    const favButton = document.createElement('button');
    favButton.classList.add('toggle-favorite');
    favButton.onclick = function () {
        const isFavorite = localStorage.getItem(pokemon.id) != null;
        if (!isFavorite) {
            card.classList.add('favorite');
            localStorage.setItem(pokemon.id, "id");
        } else {
            card.classList.remove('favorite');
            localStorage.removeItem(pokemon.id);
        };
    };
    const pokeball = document.createElement('img');
    pokeball.src = '/images/pokeball.svg';
    favButton.appendChild(pokeball);
    card.appendChild(favButton);
    return card;
};

const pokedex = document.querySelector('.pokedex');
const searchInput = pokedex.querySelector('.search-input');
const showAll = pokedex.querySelector('.show-all');
const showFavorites = pokedex.querySelector('.show-favorites');
const catalog = pokedex.querySelector('.catalog');

showFavorites.onclick = function () {
    pokedex.dataset.filter = 'show-favorites';
};

showAll.onclick = function () {
    pokedex.dataset.filter = 'show-all';
};

searchInput.oninput = function () {
    for (const pokemon of pokemons) {
        const pokemonCard = pokedex.querySelector(`[data-pokemon-id="${pokemon.id}"]`);
        const match = pokemon.name.includes(searchInput.value) || pokemon.id == searchInput.value;
        pokemonCard.style.display = match ? '' : 'none';
    };
};

let pokemons = null;
void async function main() {
    pokemons = await fetchAllPokemons();
    console.log(pokemons);
    for (const pokemon of pokemons) {
        catalog.appendChild(createCard(pokemon));
    };
}();