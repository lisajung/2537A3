
const setup = async () => {
    console.log("Setup is running");

    const result = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810")
    //const pokemons = result.data.results;

    
     const pokemons = result.data.results.slice(0, 10)

    for (let i = 0; i < pokemons.length; i++) {
        //pokemons.forEach(async (pokemon, index) => {
        pokemon = pokemons[i]
        index = i

        const pokemonResult = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        console.log(pokemonResult);

        // array of ability names
        const abilityNames = pokemonResult.data.abilities.map((ability) => ability.ability.name);

        // array of type names
        const typeNames = pokemonResult.data.types.map((type) => type.type.name);


        $("#main").append(`
        <div class="card" style="width: 18rem;">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${pokemon.name}</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
          
          <!-- Button trigger modal -->
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal${pokemon.name}">
              Launch demo modal
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
                      <p>Abilities: ${abilityNames.join(", ")}</p>
                      <p>Types: ${typeNames.join(", ")}</p>
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


    //get 81 buttons
    const PAGE_SIZE = 10
    const numberOfButtons = Math.ceil(pokemons.length / PAGE_SIZE)
    for (let i = 0; i < numberOfButtons; i++) {
        $("#paginationControls").append(`
        <button type="button" class="btn btn-primary">${i + 1}</button>
        `)
    }

   
}

$(document).ready(setup)

