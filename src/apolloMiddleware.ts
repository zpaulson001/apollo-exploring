import { createMiddleware } from 'hono/factory';
import { StatusCode } from 'hono/utils/http-status';
import { stream } from 'hono/streaming';
import {
  HeaderMap,
  type ApolloServer,
  type HTTPGraphQLRequest,
} from '@apollo/server';

export function createApolloMiddleware(server: ApolloServer) {
  return createMiddleware(async (c, next) => {
    if (!c.req.raw.body) {
      return c.json({ error: 'No body' }, 400);
    }

    const body = await c.req.json();
    console.log(JSON.stringify(body));

    const headers = new HeaderMap(c.req.raw.headers);
    const search = new URL(c.req.raw.url).search;

    const httpGraphQLRequest: HTTPGraphQLRequest = {
      method: c.req.raw.method,
      body: body,
      headers: headers,
      search: search,
    };

    const result = await server.executeHTTPGraphQLRequest({
      httpGraphQLRequest,
      context: async () => ({}),
    });

    for (const [key, value] of result.headers) {
      c.header(key, value);
    }

    if (result.body.kind === 'complete') {
      console.log(result.body.string);
      return c.json(
        JSON.parse(result.body.string),
        result.status as StatusCode
      );
    }

    for await (const chunk of result.body.asyncIterator) {
      return stream(c, async (stream) => {
        await stream.write(chunk);
      });
    }

    await next();
  });
}
