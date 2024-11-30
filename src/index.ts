import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import { resolvers } from './resolvers.ts';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { createApolloMiddleware } from './apolloMiddleware.ts';

const app = new Hono();

app.use(logger());

const typeDefs = gql.gql(
  Deno.readTextFileSync(Deno.cwd() + '/src/schema.graphql')
);

const server = new ApolloServer({ typeDefs, resolvers, introspection: true });
await server.start();

app.use('graphql', createApolloMiddleware(server));

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

Deno.serve({ port: 8787 }, app.fetch);
