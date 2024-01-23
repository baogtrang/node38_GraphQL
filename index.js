// install libraries: express nodemon prisma @prisma/client mysql2 dotenv graphql express-graphql
import express from "express";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";

const rootSchema = buildSchema(`
    type User {
        id: Int
        name: String
    }

    type rootMutation {
        createUser: String
    } 

    type rootQuery {
        getUser(id: Int, name: String): User
    }
    
    schema {
        query: rootQuery,
        mutation: rootMutation
    }
`);

const resolver = {
  getUser: ({ id, name }) => {
    return {
      id: id,
      name: name,
    };
  },
  createUser: () => {
    return "createUser";
  },
};

const app = express();
app.use(
  "/graph",
  graphqlHTTP({
    schema: rootSchema, //schema definition for BE and FE
    rootValue: resolver, //function definition for APIs
    graphiql: true,
  })
);

app.listen(8080, () => {
  console.log("BE starting with port 8080");
});
