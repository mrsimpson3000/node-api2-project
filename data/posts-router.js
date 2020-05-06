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

module.exports = router;
