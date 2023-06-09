const PAGE_SIZE = 10;
let currentPage = 1;
let pokemons = [];

const setup = async () => {
    console.log("Setup is running");

    const result = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810");
    pokemons = result.data.results;


    const numberOfButtons = Math.ceil(pokemons.length / PAGE_SIZE);

    //add page buttons
    for (let i = 0; i < numberOfButtons; i++) {
        $("#paginationControls").append(`
      <button type="button" class="btn btn-primary">${i + 1}</button>
    `);
    }

    // Set the text content of the new HTML elements
    $("#total-count").text(`Total Pokémons: ${pokemons.length}`);
    $("#displayed-count").text(`Pokémons displayed: ${Math.min(PAGE_SIZE, pokemons.length)}`);

    const setPage = (pageNumber) => {
        $("#paginationControls button").removeClass("active");
        $(`#paginationControls button:nth-child(${pageNumber + 1})`).addClass("active");
        currentPage = pageNumber;
        displayPokemons();
        showOrHidePreviousAndNextButtons();
    }

    // add event listener to buttons
    $("#paginationControls button").on("click", (event) => {
        currentPage = parseInt(event.target.innerText);
        setPage(currentPage);
    });


    $("#paginationControls").prepend(`
    <button type="button" class="btn btn-primary" id="previousButton">Previous</button>
  `);

    // event listener to previous button
    $("#previousButton").on("click", () => {
        if (currentPage > 1) {
            setPage(currentPage - 1);
        }
    });


    $("#paginationControls").append(`
    <button type="button" class="btn btn-primary" id="nextButton">Next</button>
  `);

    // event listener to next button
    $("#nextButton").on("click", () => {
        if (currentPage < numberOfButtons) {
            setPage(currentPage + 1);
        }
    });

    // show the first page of pokemons on setup
    displayPokemons();
    showOrHidePreviousAndNextButtons();
};

const showOrHidePreviousAndNextButtons = () => {
    const numberOfButtons = Math.ceil(pokemons.length / PAGE_SIZE);

    if (currentPage == 1) {
        $("#previousButton").hide();
    } else {
        $("#previousButton").show();
    }

    if (currentPage == numberOfButtons) {
        $("#nextButton").hide();
    } else {
        $("#nextButton").show();
    }
};

const fetchPokemonTypes = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/type');
    const pokemonTypes = response.data.results;
    const typeCheckboxes = pokemonTypes.map(
        (type) => `
        <label>
          <input type="checkbox" name="type" value="${type.name}" />
          ${type.name}
        </label>
      `
    );
    const checkboxesContainer = document.querySelector('#type-checkboxes');
    checkboxesContainer.innerHTML = typeCheckboxes.join('');
};
fetchPokemonTypes();

const filterPokemonByType = () => {
    const selectedTypes = [...document.querySelectorAll('input[name="type"]:checked')].map(input => input.value);
    console.log(selectedTypes);
    const filteredPokemons = pokemons.filter(pokemon => {
      return pokemon.types && pokemon.types.some(type => selectedTypes.includes(type.type.name));
    });
    displayPokemons(filteredPokemons);
  };
  


const displayPokemons = async () => {
    document.querySelector('#type-checkboxes').addEventListener('change', filterPokemonByType);

    $("#main").empty();

    const startingIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startingIndex + PAGE_SIZE;
    const splicedPokemons = pokemons.slice(startingIndex, endIndex);

    for (let i = 0; i < splicedPokemons.length; i++) {
        const pokemon = splicedPokemons[i];

        const pokemonResult = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );

        const abilityNames = pokemonResult.data.abilities.map(
            (ability) => `<li>${ability.ability.name}</li>`
        );

        const stats = pokemonResult.data.stats.map(
            (stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`
        );

        const typeNames = pokemonResult.data.types.map(
            (type) => `<li>${type.type.name}</li>`
        );




        $("#main").append(`

      <div class="card" style="width: 18rem;">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i + 1 + startingIndex}.png" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${pokemon.name}</h5>

          <!-- Button trigger modal -->
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal${pokemon.name}">
            Pokemon details
          </button>

          <!-- Modal -->
          <div class="modal fade" id="exampleModal${pokemon.name}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">${pokemon.name}</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <p> Pokemon ID: ${pokemonResult.data.id}</p>
                  <p>Abilities: ${abilityNames.join(" ")}</p>
                  <p>Stats: ${stats.join(" ")}</p>
                  <p>Types: ${typeNames.join(" ")}</p>
                </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      </div>
                  </div>
              </div>
          </div>


        </div>
      </div>
        `)
    }
};


$(document).ready(setup)

