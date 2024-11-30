import db from './datasources/db.ts';

async function fetchPokemon(id: number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  data.types = data.types.map((type) => type.type.name);
  return data;
}

export const resolvers = {
  Query: {
    allTrainers: () => {
      return db.trainers;
    },
    pokemon: async (_, args) => {
      const data = await fetchPokemon(args.id);

      return data;
    },
  },
  Trainer: {
    pokemon: async (parent) => {
      // Create an array of promises for concurrent fetching
      if (!parent.pokemon) return [];
      const pokemonPromises = parent.pokemon.map((pokemon_id) => {
        return fetchPokemon(pokemon_id);
      });

      // Wait for all promises to resolve
      const pokemon = await Promise.all(pokemonPromises);
      return pokemon;
    },
  },
};
