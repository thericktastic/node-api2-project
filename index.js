const express = require("express");

const postsRouter = require("./blog-posts/posts-router.js");

// const Posts = require("./data/db.js");

const server = express();

// This is needed to parse JSON from the body
server.use(express.json());

// For URLS beginning with /api/posts
server.use("/api/posts", postsRouter);

// This is a test response to make sure the server is responding
server.get("/", (request, response) => {
  response.send(`<h2>Lambda Hubs API</h2>`);
});

server.listen(8000, () => {
  console.log("\n*** Server Running on http://localhost:8000 ***\n");
});
