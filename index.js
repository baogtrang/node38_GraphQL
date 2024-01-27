// install libraries: express nodemon prisma @prisma/client mysql2 dotenv graphql express-graphql
import express from "express";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const rootSchema = buildSchema(`
    type User {
        id: Int
        name: String
    }

    type Video {
      video_id: Int 
      video_name: String 
      thumbnail: String 
      views: Int 
      source: String
      user_id: Int 
      type_id: Int 
    }

    type rootMutation {
        createUser: String
        createVideo(video_name: String, thumbnail: String, description: String, views: Int, source: String, user_id: Int, type_id: Int): Boolean
        updateVideo(video_id: Int, video_name: String, thumbnail: String, description: String, views: Int, source: String, user_id: Int, type_id: Int): Boolean
    } 

    type rootQuery {
        getUser(id: Int, name: String): User
        getVideoList(videoType: Int): [Video]
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
  getVideoList: async ({ videoType }) => {
    let data = await prisma.video.findMany({
      where: {
        type_id: videoType,
      },
    });
    return data;
  },
  createUser: () => {
    return "createUser";
  },
  createVideo: async ({
    video_name,
    thumbnail,
    description,
    views,
    source,
    user_id,
    type_id,
  }) => {
    try {
      let newVideo = {
        video_name,
        thumbnail,
        description,
        views,
        source,
        user_id,
        type_id,
      };
      await prisma.video.create({
        data: newVideo,
      });
      return true;
    } catch (error) {
      console.log("error:", error);
      return false;
    }
  },
  updateVideo: async ({
    video_id,
    video_name,
    thumbnail,
    description,
    views,
    source,
    user_id,
    type_id,
  }) => {
    try {
      let checkVideo = await prisma.video.findFirst({
        where: {
          video_id: video_id,
        },
      });
      if (!checkVideo) {
        return false;
      }
      let updateVideo = {
        video_id,
        video_name,
        thumbnail,
        description,
        views,
        source,
        user_id,
        type_id,
      };
      await prisma.video.update({
        where: {
          video_id: video_id,
        },
        data: updateVideo,
      });
      return true;
    } catch (error) {
      console.log("error:", error);
      return false;
    }
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
