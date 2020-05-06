const express = require("express");

const router = express.Router();

const Posts = require("./db.js");

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post.length > 0) {
        Posts.findPostComments(req.params.id)
          .then((comments) => {
            res.status(200).json(comments);
          })
          .catch((error) => {
            console.log(error);
            res
              .status(500)
              .json({ error: "The post information could not be retrieved." });
          });
      } else {
        res
          .status(500)
          .json({ error: "The post information could not be retrieved." });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    });
});

router.post("/", (req, res) => {
  if (req.body.title && req.body.contents) {
    let postInfo = {
      created_at: Date(),
      updated_at: Date(),
      ...req.body,
    };
    Posts.insert(postInfo)
      .then((post) => {
        res.status(201).json(postInfo);
      })
      .catch((error) => {
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
});

router.post("/:id/comments", (req, res) => {
  Posts.findById(req.params.id)
    .then((response) => {
      let post = response.find((posts) => req.params.id);
      if (req.body.text) {
        let comment = {
          text: req.body.text,
          post_id: req.params.id,
          created_at: post.created_at,
          updated_at: Date(),
        };
        Posts.insertComment(comment)
          .then((response) => {
            res.status(201).json(comment);
          })
          .catch((error) => {
            res.status(500).json({
              error: "There was an error while saving the post to the database",
            });
          });
      } else {
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      }
    })
    .catch((error) => {
      res.status(404).json({
        message: "The post with the specified ID does not exist.",
      });
    });
});

router.delete("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((response) => {
      let deletedPost = response.find((posts) => req.params.id);
      Posts.remove(req.params.id)
        .then((response) => {
          res.status(200).json(deletedPost);
        })
        .catch((error) => {
          res.status(500).json({ error: "The post could not be removed" });
        });
    })
    .catch((error) => {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    });
});

router.put("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((response) => {
      let oldPost = response.find((posts) => req.params.id);
      if (req.body.title && req.body.contents) {
        let updatedPost = {
          title: req.body.title,
          contents: req.body.contents,
          created_at: oldPost.created_at,
          updated_at: Date(),
        };
        Posts.update(req.params.id, updatedPost)
          .then((response) => {
            console.log(response);
            res.status(200).json(updatedPost);
          })
          .catch((error) => {
            res
              .status(500)
              .json({ error: "The post information could not be modified." });
          });
      } else {
        res
          .status(400)
          .json({
            errorMessage: "Please provide title and contents for the post.",
          });
      }
    })
    .catch((error) => {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    });
});

module.exports = router;
