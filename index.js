const express = require("express");
const postRouter = require("./data/posts-router.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.json({ api: "Up and running!" });
});

server.use("/api/posts", postRouter);

server.listen(process.env.PORT || 4000, () => {
  console.log("\n== API is up ==\n");
});
