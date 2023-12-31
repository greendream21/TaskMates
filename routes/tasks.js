const express = require("express");
const router = express.Router();
const db = require("../model/helper");

// Retrieve all tasks with user names
const getAllTasks = async (req, res) => {
  try {
    const results = await db(`
      SELECT tasks.*, users.name 
      FROM tasks 
      LEFT JOIN users ON tasks.user_id = users.id;
    `);
    res.send(results.data);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Route for getting all tasks
router.get("/", async (req, res) => {
  getAllTasks(req, res);
});

// Route for getting tasks by user ID
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const results = await db(`
      SELECT * 
      FROM tasks 
      WHERE user_id = ${user_id};
    `);
    res.send(results.data);
  } catch (err) {
    res.status(500).send({ message: `User not found` });
  }
});

// Route for adding a new task
router.post("/", async (req, res) => {
  const { description, category, user_id } = req.body;
  console.log(req.body);
  try {
    await db(`
      INSERT INTO tasks (description, isDone, category, user_id) 
      VALUES ('${description}', 0, '${category}', '${user_id}');
    `);
    getAllTasks(req, res);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route for updating task completion status
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db(`
      UPDATE tasks 
      SET isDone = !isDone 
      WHERE id=${id};
    `);
    getAllTasks(req, res);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route for deleting a task by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db(`
      DELETE FROM tasks 
      WHERE id=${id};
    `);
    getAllTasks(req, res);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
