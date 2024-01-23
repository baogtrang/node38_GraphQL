// install libraries: express nodemon prisma @prisma/client mysql2 dotenv graphql express-graphql
import express from "express";

const app = express();

app.listen(8080, () => {
  console.log("BE starting with port 8080");
});
