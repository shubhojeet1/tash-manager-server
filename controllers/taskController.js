const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.createTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  try {
    const newTask = new Task({
      user: req.user.id,
      title,
      description,
      status,
      dueDate,
    });

    const task = await newTask.save();
    req.io.emit('taskAdded', task); // Emit event when task is added
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateTask = async (req, res) => {
    const { title, description, status, dueDate } = req.body;
  
    try {
      let task = await Task.findById(req.params.id);
  
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }
  
      if (task.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
  
      task = await Task.findByIdAndUpdate(
        req.params.id,
        { $set: { title, description, status, dueDate } },
        { new: true }
      );
  
      req.io.emit('taskUpdated', task); // Emit event when task is updated
      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  

exports.deleteTask = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
  
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }
  
      // Check if the task belongs to the user making the request
      if (task.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
  
      // Use findByIdAndDelete to remove the task
      await Task.findByIdAndDelete(req.params.id);
  
      // Emit event when the task is deleted
      req.io.emit('taskDeleted', task._id);
  
      res.json({ msg: 'Task removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
