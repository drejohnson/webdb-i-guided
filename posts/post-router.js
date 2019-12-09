const express = require("express");

// database access using knex
const knex = require("../data/db-config.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await knex.select("*").from("posts");
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await knex
      .select("*")
      .from("posts")
      .where({ id: req.params.id })
      .first();
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const postData = req.body;
  try {
    if (!req.body)
      return res.status(500).send({ errorMessage: "Missing required" });
    const ids = await knex("posts").insert(postData, "id");
    const id = ids[0];
    const post = await knex("posts")
      .select("id", "title", "contents")
      .where({ id })
      .first();
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const changes = req.body;
  const { id } = req.params;
  try {
    if (!req.body)
      return res.status(500).send({ errorMessage: "Missing required data" });
    const count = await knex("posts")
      .where({ id })
      .update(changes);

    if (count === 0)
      return res.status(404).send({ errorMessage: "No Posts found" });

    res.status(200).json({ message: `${count} record has been updated` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const count = await knex("posts")
      .where({ id })
      .delete();

    if (count === 0)
      return res.status(404).send({ errorMessage: "No Posts found" });
    res.status(200).json({ message: `${count} record has been deleted` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
