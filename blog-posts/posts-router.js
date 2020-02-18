const express = require("express");

const Posts = require("../data/db");

const router = express.Router();

// This is a GET request for all blog posts
router.get("/", (request, response) => {
  Posts.find(request.query)
    .then(postsFound => {
      response.status(200).json(postsFound);
    })
    .catch(error => {
      console.log("This is error in router.get: ", error);
      response.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

// This is a GET request for a specified blog post
router.get("/:id", (request, response) => {
  const { id } = request.params;
  Posts.findById(id)
    .then(postFound => {
      if (postFound && postFound.length > 0) {
        console.log(
          "This is postFound in router.get(/api/posts/:id): ",
          postFound
        );
        response.status(200).json(postFound);
      } else {
        response
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log("This is error in router.get(/api/posts/:id): ", error);
      response.status(500).json({ error: "Error retrieving the post" });
    });
});

// This is a GET request for comments of a specified blog post
router.get("/:id/comments", (request, response) => {
  const { id } = request.params;
  Posts.findPostComments(id)
    .then(commentsFound => {
      if (commentsFound && commentsFound.length > 0) {
        response.status(200).json(commentsFound);
      } else {
        response
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log(
        "This is error in router.get(/api/posts/:id/comments): ",
        error
      );
      response.status(500).json({
        error: "The comments information could not be retrieved."
      });
    });
});

// This is a POST request for all posts
router.post("/", (request, response) => {
  if (!request.body.title || !request.body.contents) {
    response
      .status(400)
      .json({ error: "Please provide title and contents for the post." });
  } else {
    Posts.insert(request.body)
      .then(addedPost => {
        response.status(201).json(addedPost);
      })
      .catch(error => {
        console.log("This is error in server.post(/api/posts): ", error);
        response.status(500).json({
          error: "There was an error while saving the post to the database."
        });
      });
  }
});

// This is a POST request for posting a comment on a specified blog post
// Fix the 404 error for this one
router.post("/:id/comments", (request, response) => {
  if (!request.body.text) {
    response
      .status(400)
      .json({ error: "Please provide text for the comment." });
  } else {
    const { id } = request.params;
    const fullComment = { ...request.body, post_id: id };
    Posts.insertComment(fullComment)
      .then(newComment => {
        if (newComment) {
          response.status(201).json(newComment);
        } else {
          response.status(404).json({
            error: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(error => {
        console.log(
          "This is error in server.post(/api/posts/:id/comments): ",
          error
        );
        res.status(500).json({ error: "There was an error while saving the comment to the database." });
      });
  }
});

// This is a PUT request to update a specific blog post
router.put("/:id", (request, response) => {
  if (!request.body.title || !request.body.contents) {
    response
      .status(400)
      .json({ error: "Please provide title and contents for the post." });
  } else {
    const editedPost = request.body;
    const { id } = request.params;
    Posts.update(id, editedPost)
      .then(update => {
        if (update) {
          response.status(200).json(update);
        } else {
          response
            .status(404)
            .json({
                error: "The post with the specified ID does not exist."
            });
        }
      })
      .catch(error => {
        console.log("This is error in server.put(/api/posts/:id): ", error);
        response.status(500).json({ error: "Error updating the post" });
      });
  }
});

// This is a DELETE request to delete a specific blog post
router.delete("/:id", (request, response) => {
  const { id } = request.params;
  Posts.remove(id)
    .then(count => {
      if (count > 0) {
        response.status(200).json({ message: "The post has been nuked." });
      } else {
        response
          .status(404)
          .json({ error: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log("This is error in server.delete(/api/posts/:id): ", error);
      response.status(500).json({ error: "The post could not be removed." });
    });
});

module.exports = router;
