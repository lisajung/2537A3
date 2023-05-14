
const setup = async () => {
    console.log("Setup is running");

    const result = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810")
    const pokemons = result.data.results;

    pokemons.forEach((pokemon, index) => {
        $("#main").append(`
        <div class="card" style="width: 18rem;">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${pokemon.name}</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>
        `)
    })
}

$(document).ready(setup)

