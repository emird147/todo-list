let tasks = [];
let currentId = 1;

export default function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json(tasks);
    }

    if (req.method === 'POST') {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Task title is required' });
        }
        const newTask = { id: currentId++, title, completed: false };
        tasks.push(newTask);
        return res.status(201).json(newTask);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
