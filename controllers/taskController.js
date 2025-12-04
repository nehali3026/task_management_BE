const Task = require("../models/Task");
const User = require("../models/User");

const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const isAdmin = req.user.role === "admin";

    const whereCondition = isAdmin ? {} : { userId: req.user.id };

    const tasks = await Task.findAll({
      where: whereCondition,
      include: [{ model: User, attributes: ["username"] }],
      order: [["createdDate", "DESC"]],
      limit,
      offset,
    });

    const total = await Task.count({ where: whereCondition });
    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      status,
      userId: req.user.id,
    });
    const populatedTask = await Task.findByPk(task.id, {
      include: [{ model: User, attributes: ["username"] }],
    });
    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.update({ title, description, status });
    const updatedTask = await Task.findByPk(id, {
      include: [{ model: User, attributes: ["username"] }],
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Admin can delete any; no ownership check here since middleware ensures admin
    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
