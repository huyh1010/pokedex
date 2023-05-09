const csv = require("csvtojson");
const fs = require("fs");
const crypto = require("crypto");

const baseUrl = "http://localhost:8000";

const getPokemon = async () => {
  const newData = await csv().fromFile("pokemon.csv");

  let data = JSON.parse(fs.readFileSync("pokemon.json"));
  let images = fs.readdirSync("public/images");

  if (data.pokemons.length) {
    for (let i = 0; i < data.pokemons.length; i++) {
      if (images.includes(`${i + 1}.png`)) {
        const pokemon = data.pokemons[i];
        pokemon["url"] = `${baseUrl}/images/${i + 1}.png`;
        data.pokemons[i] = pokemon;
      }
    }
  } else {
    data.pokemons = newData;
  }

  fs.writeFileSync("pokemon.json", JSON.stringify(data));
};

// getPokemon();

const editPokemonTypes = () => {
  let data = JSON.parse(fs.readFileSync("pokemon.json"));

  for (let i = 0; i < data.pokemons.length; i++) {
    const pokemon = data.pokemons[i];
    let type1 = data.pokemons[i].type1;
    let type2 = data.pokemons[i].type2 ? data.pokemons[i].type2 : null;
    const types = [type1, type2];
    pokemon["types"] = types;
    console.log(pokemon);
  }
};

// editPokemonTypes();

const pokemonLowerCase = () => {
  let data = JSON.parse(fs.readFileSync("pokemon.json"));
  if (data.pokemons.length) {
    for (let i = 0; i < data.pokemons.length; i++) {
      const pokemon = data.pokemons[i];
      const objectLowerCase = Object.keys(pokemon).reduce(
        (prev, current) => ({
          ...prev,
          [current.toLowerCase()]: pokemon[current].toLowerCase(),
        }),
        {}
      );
      data.pokemons[i] = objectLowerCase;
    }
  }

  fs.writeFileSync("pokemon.json", JSON.stringify(data));
};
// pokemonLowerCase();

// const addPokemonstats = async () => {
//   const newData = await csv().fromFile("pokemonextrafeatures.csv");
//   console.log(newData.length);
//   for (let i = 0; i < newData.length; i++) {
//     const pokemon = newData[i];
//     const stats = {
//       abilities: pokemon.abilities,
//       height: pokemon.height_m,
//       weight: pokemon.weight_kg,
//       classification: pokemon.classification,
//     };
//   }
// };

// addPokemonstats();

const filterPokemon = () => {
  let data = JSON.parse(fs.readFileSync("pokemon.json"));
  if (data.pokemons.length) {
    data.pokemons = data.pokemons.filter((pokemon) => pokemon.image);
  }
  fs.writeFileSync("pokemon.json", JSON.stringify(data));
};

// filterPokemon();

const createPokemonId = () => {
  let data = JSON.parse(fs.readFileSync("pokemon.json"));
  if (data.pokemons.length) {
    for (let i = 0; i < data.pokemons.length; i++) {
      const pokemon = data.pokemons[i];
      pokemon["id"] = `${i + 1}`;
      data.pokemons[i] = pokemon;
    }
  }
  fs.writeFileSync("pokemon.json", JSON.stringify(data));
};

createPokemonId();
const renameImage = () => {
  fs.readdir("public/images", (err, files) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(files);
      files.forEach((file, index) => {
        fs.rename(
          `public/images/${file}`,
          `public/images/${index + 1}.png`,
          (err) => console.log(err)
        );
      });
    }
  });
};

// renameImage();
