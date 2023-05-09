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

    res.status(200).send(result);
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
    if (!name || !types || !id || !url) {
      const exception = new Error(`Missing required info`);
      exception.statusCode = 401;
      throw exception;
    }

    let db = JSON.parse(fs.readFileSync("pokemon.json", "utf-8"));
    const { pokemons } = db;
    const type1 = pokemons.forl;
    const type2 = pokemons.type2;
    console.log(type1);
    const newPokemon = { Name, Type1, Type2, id, image };
  } catch (error) {
    next(error);
  }
});
module.exports = router;
