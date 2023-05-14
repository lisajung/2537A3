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


const displayPokemons = async () => {
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
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>

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
                          <button type="button" class="btn btn-primary">Save changes</button>
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

