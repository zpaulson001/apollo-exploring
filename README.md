# Apollo Exploring 👨‍🚀

This is a simple project to explore the inner workings of Apollo Server. Currently, it just fetches data about Trainers and their Pokémon. The data for trainers is stored in db.ts while the data for Pokémon is fetched from the [PokéAPI](https://pokeapi.co/).

This project is running on Deno, and the Apollo Server is served with Hono.

As there is no official middleware for using Apollo Server with Hono, I decided to write my own based on the [Apollo expressMiddleware](https://github.com/apollographql/apollo-server/blob/main/packages/server/src/express4/index.ts).
