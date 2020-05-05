const express = require("express");

const router = express.Router();

const Posts = require("./db.js");

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(hubs);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

module.exports = router;
