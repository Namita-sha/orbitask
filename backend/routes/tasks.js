const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

router.use(protect);

// Helper: check project access
const checkProjectAccess = async (projectId, userId, userRole) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: 'Project not found', status: 404 };
  
  const isOwner = project.owner.toString() === userId.toString();
  const isMember = project.members.some(m => m.user.toString() === userId.toString());
  
  if (!isOwner && !isMember && userRole !== 'Admin') {
    return { error: 'Access denied', status: 403 };
  }
  
  return { project, isOwner };
};

// @GET /api/tasks?project=id - Get tasks for a project
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @GET /api/tasks/my - Get tasks assigned to current user
router.get('/my', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'name color')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @GET /api/tasks/dashboard - Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    // Get all projects user has access to
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
    });
    const projectIds = projects.map(p => p._id);

    const [totalTasks, myTasks, overdueTasks, statusBreakdown, recentTasks] = await Promise.all([
      Task.countDocuments({ project: { $in: projectIds } }),
      Task.countDocuments({ assignedTo: req.user._id, status: { $ne: 'Done' } }),
      Task.countDocuments({
        project: { $in: projectIds },
        dueDate: { $lt: new Date() },
        status: { $ne: 'Done' }
      }),
      Task.aggregate([
        { $match: { project: { $in: projectIds } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Task.find({ project: { $in: projectIds } })
        .populate('assignedTo', 'name')
        .populate('project', 'name color')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const statusMap = {};
    statusBreakdown.forEach(s => { statusMap[s._id] = s.count; });

    res.json({
      totalProjects: projects.length,
      totalTasks,
      myTasks,
      overdueTasks,
      statusBreakdown: statusMap,
      recentTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @POST /api/tasks - Create task
router.post('/', [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('project').notEmpty().withMessage('Project is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { title, description, project, assignedTo, status, priority, dueDate, tags } = req.body;

    const access = await checkProjectAccess(project, req.user._id, req.user.role);
    if (access.error) return res.status(access.status).json({ message: access.error });

    const task = await Task.create({
      title, description, project, assignedTo, status, priority, dueDate,
      tags: tags || [],
      createdBy: req.user._id
    });

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const access = await checkProjectAccess(task.project, req.user._id, req.user.role);
    if (access.error) return res.status(access.status).json({ message: access.error });

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('project', 'name');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const access = await checkProjectAccess(task.project, req.user._id, req.user.role);
    if (access.error) return res.status(access.status).json({ message: access.error });

    // Only Admin, project owner, or task creator can delete
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    if (!access.isOwner && !isCreator && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;