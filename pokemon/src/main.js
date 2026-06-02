import './style.css'

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const PAGE_SIZE = 10;
let offset = 0;


const getPokemonList = async (offset = 0, limit = 10) => {
  const response = await fetch(`${BASE_URL}?offset=${offset}&limit=${limit}`);
  const data = await response.json();
  return data.results;
}

/* 
  Crea una lista de pokemons, al click buscar el pokemon por su id. (find by id)
 */
const createPokemonList = (pokemons) => {
    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.innerHTML = '';
    pokemons.forEach((pokemon, index) => {
        const item = document.createElement('li');
        const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
        item.dataset.id = pokemonId;
        item.textContent = pokemon.name;
        pokemonList.appendChild(item);
    });
}

const getPokemonById = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`);
    const data = await response.json();
    return data;
}

const renderPokemon = (pokemon) => {
    const pokemonImage = document.querySelector('.random-image');
    const pokemonInfo = document.querySelector('.info');
    pokemonImage.src = pokemon.sprites.front_default;
    pokemonImage.alt = pokemon.name;
    pokemonImage.title = pokemon.name;
    pokemonInfo.innerHTML = `
        <h2>${pokemon.name}</h2>
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <p>Types: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
    `;
}

/*
 La api cuenta con 
 count : 1350
 next : "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20"
 previous: null
*/

const updatePreviousButtonState = () => {
    const previousButton = document.getElementById('previous-button');
    previousButton.disabled = offset === 0;
};

const loadPage = async () => {
    const pokemons = await getPokemonList(offset, PAGE_SIZE);
    createPokemonList(pokemons);
    updatePreviousButtonState();
};

const createPagination = () => {
    const nextButton = document.getElementById('next-button');
    const previousButton = document.getElementById('previous-button');

    previousButton.addEventListener('click', async () => {
        if (offset === 0) return;
        offset -= PAGE_SIZE;
        await loadPage();
    });

    nextButton.addEventListener('click', async () => {
        offset += PAGE_SIZE;
        await loadPage();
    });
} 

const addPokemonListListener = () => {
    const pokemonList = document.getElementById('pokemon-list');

    pokemonList.addEventListener('click', async (event) => {
        const item = event.target;
        if (item.tagName !== 'LI') return;
        const id = item.dataset.id;
        const pokemon = await getPokemonById(id);
        renderPokemon(pokemon);
    });
}


const init = async () => {
    const pokemon = await getPokemonById(1);
    await loadPage();
    renderPokemon(pokemon);
    addPokemonListListener();
    createPagination();
};

init();