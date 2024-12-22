let tasks = [];

export default function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'PUT') {
        const { title, completed } = req.body;
        const task = tasks.find(t => t.id === parseInt(id));
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        if (title !== undefined) task.title = title;
        if (completed !== undefined) task.completed = completed;
        return res.status(200).json(task);
    }

    if (req.method === 'DELETE') {
        const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }
        tasks.splice(taskIndex, 1);
        return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
