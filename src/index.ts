import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';

const typeDefs = gql.gql(Deno.readTextFileSync('./schema.txt'));

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀 Server ready at ${url}`);
}

startApolloServer();
