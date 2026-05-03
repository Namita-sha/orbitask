const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Todo', 'In Progress', 'Review', 'Done'], default: 'Todo' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  dueDate: { type: Date },
  tags: [{ type: String, trim: true }],
  completedAt: { type: Date }
}, { timestamps: true });

TaskSchema.pre('save', function() {
  if (this.isModified('status') && this.status === 'Done' && !this.completedAt) {
    this.completedAt = new Date();
  }
  if (this.isModified('status') && this.status !== 'Done') {
    this.completedAt = undefined;
  }
});

TaskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.status !== 'Done' ? new Date() > this.dueDate : false;
});

TaskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', TaskSchema);
