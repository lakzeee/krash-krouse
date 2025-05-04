import 'reflect-metadata';
import { createYoga } from 'graphql-yoga';
import { buildSchema, Query, Resolver } from 'type-graphql';
import { prisma } from '@/services/prisma';
import { GraphQLContext } from '@/server/context';

@Resolver()
class HelloResolver {
  @Query(() => String)
  hello() {
    return 'Hello World!';
  }
}

const schema = await buildSchema({
  resolvers: [HelloResolver],
});

const yoga = createYoga<GraphQLContext>({
  schema,
  context: { prisma }, 
  fetchAPI: { Response }
});

export { yoga as GET, yoga as POST };
