const express = require("express");

const Posts = require("./data/db.js");

const server = express();

// This is needed to parse JSON from the body
server.use(express.json());

// This is a test response to make sure the server is responding
server.get("/", (request, response) => {
  response.send(`<h2>Lambda Hubs API</h2>`);
});

// This is a POST request for all posts
server.post("/api/posts", (request, response) => {
  Posts.insert(request.body)
    .then(addedPost => {
      response.status(201).json(addedPost);
    })
    .catch(error => {
      console.log("This is error in server.post(/api/posts): ", error);
      response.status(500).json({ errorMessage: "Error adding the post" });
    });
});

// This is a POST request for a specified blog post
server.post("/api/posts/:id/comments", (request, response) => {
  const { id } = request.params;
  Posts.findPostComments(id)
    .then(commentsFound => {
      response.status(200).json(commentsFound);
    })
    .catch(error => {
      console.log(
        "This is error in server.post(/api/posts/:id/comments): ",
        error
      );
      res.status(500).json({ errorMessage: "Sorry" });
    });
});

// This is a GET request for all posts
server.get("/api/posts", (request, response) => {
  Posts.find(request.query)
    .then(postsFound => {
      response.status(200).json(postsFound);
    })
    .catch(error => {
      console.log("This is error in server.get: ", error);
      response.status(500).json({
        errorMessage: "Error retrieving the posts"
      });
    });
});

// This is a PUT request

server.listen(8000, () => {
  console.log("\n*** Server Running on http://localhost:8000 ***\n");
});
