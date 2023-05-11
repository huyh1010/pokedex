var express = require("express");
var router = express.Router();

const fs = require("fs");

router.get("/", (req, res, next) => {
  try {
    let { page, limit, name, type } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 12;

    let offset = limit * (page - 1);

    let db = JSON.parse(fs.readFileSync("pokemon.json", "utf-8"));
    const { pokemons } = db;
    let result = [];

    if (name) {
      result = result.length
        ? result.filter((e) => e.name === name)
        : pokemons.filter((e) => e.name === name);
    } else if (type) {
      result = result.length
        ? result.filter((e) => e.type1 === type || e.type2 === type)
        : pokemons.filter((e) => e.type1 === type || e.type2 === type);
    } else {
      result = pokemons;
    }

    result = result.slice(offset, offset + limit);
    const data = { data: result };

    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

router.get("/:pokemonId", (req, res, next) => {
  try {
    const { pokemonId } = req.params;

    let db = JSON.parse(fs.readFileSync("pokemon.json", "utf-8"));
    const { pokemons } = db;

    const targetPokemonIndex = pokemons.findIndex((e) => e.id === pokemonId);
    const pokemon = pokemons[targetPokemonIndex];
    const previousPokemon =
      targetPokemonIndex === 0
        ? pokemons[808]
        : pokemons[targetPokemonIndex - 1];
    const nextPokemon =
      targetPokemonIndex === 808
        ? pokemons[0]
        : pokemons[targetPokemonIndex + 1];

    if (targetPokemonIndex < 0) {
      const exception = new Error(`Pokemon not found`);
      exception.statusCode = 404;
      throw exception;
    }

    const result = {
      pokemon: pokemon,
      previousPokemon: previousPokemon,
      nextPokemon: nextPokemon,
    };

    const data = { data: result };

    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    const { name, types, id, url } = req.body;
    console.log(types);
    if (!name || !types || !id || !url) {
      const exception = new Error(`Missing required info`);
      exception.statusCode = 401;
      throw exception;
    }
    if (types.length > 2) {
      const exception = new Error("Pokémon can only have one or two types");
      exception.statusCode = 401;
      throw exception;
    }
    const pokemonTypes = [
      "bug",
      "dragon",
      "fairy",
      "fire",
      "ghost",
      "ground",
      "normal",
      "psychic",
      "steel",
      "dark",
      "electric",
      "fighting",
      "flying",
      "grass",
      "ice",
      "poison",
      "rock",
      "water",
    ];

    types.forEach((type) => {
      if (!pokemonTypes.includes(type)) {
        const exception = new Error("Pokémon's type is invalid");
        exception.statusCode = 401;
        throw exception;
      }
    });

    let db = JSON.parse(fs.readFileSync("pokemon.json", "utf-8"));
    const { pokemons } = db;

    const newPokemon = { name, types, id, url };

    pokemons.forEach((pokemon) => {
      const pokemonName = pokemon.name;
      const pokemonId = pokemon.id;
      if (pokemonName === name || pokemonId === id) {
        const exception = new Error(
          "Name or Id already exists in the database"
        );
        exception.statusCode = 401;
        throw exception;
      }
    });

    pokemons.push(newPokemon);
    db.pokemons = pokemons;
    fs.writeFileSync("pokemon.json", JSON.stringify(db));

    res.status(200).send(newPokemon);
  } catch (error) {
    next(error);
  }
});
module.exports = router;

router.put("/:pokemonId", (req, res, next) => {
  try {
    const allowedUpdate = ["name", "types", "url"];
    const { pokemonId } = req.params;
    const update = req.body;
    const updateKeys = Object.keys(update);
    const notAllow = updateKeys.filter((key) => !allowedUpdate.includes(key));

    if (notAllow.length) {
      const exception = new Error("Update field not allow");
      exception.statusCode = 401;
      throw exception;
    }

    let db = fs.readFileSync("pokemon.json", "utf-8");
    db = JSON.parse(db);
    const { pokemons } = db;
    const targetIndex = pokemons.findIndex(
      (pokemon) => pokemon.id === pokemonId
    );

    if (targetIndex < 0) {
      const exception = new Error(`Book not found`);
      exception.statusCode = 404;
      throw exception;
    }

    const updatedPokemon = { ...db.pokemons[targetIndex], ...update };
    db.pokemons[targetIndex] = updatedPokemon;

    fs.writeFileSync("pokemon.json", JSON.stringify(db));

    res.status(200).send(updatedPokemon);
  } catch (error) {
    next(error);
  }
});

router.delete("/:pokemonId", (req, res, next) => {
  try {
    const { pokemonId } = req.params;
    let db = fs.readFileSync("pokemon.json", "utf-8");
    db = JSON.parse(db);
    const { pokemons } = db;

    const targetIndex = pokemons.findIndex(
      (pokemon) => pokemon.id === pokemonId
    );
    if (targetIndex < 0) {
      const exception = new Error(`Pokemon not found`);
      exception.statusCode = 404;
      throw exception;
    }

    db.pokemons = pokemons.filter((pokemon) => pokemon.id !== pokemonId);

    db = JSON.stringify(db);
    fs.writeFileSync("pokemon.json", db);
    res.status(200).send({});
  } catch (error) {
    next(error);
  }
});
