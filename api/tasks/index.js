import clientPromise from '../../mongodb.js';

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db('todo-list');
        const tasksCollection = db.collection('tasks');

        if (req.method === 'GET') {
            const tasks = await tasksCollection.find({}).toArray();
            res.status(200).json(tasks);
        } else if (req.method === 'POST') {
            const { title } = req.body;
            if (!title) {
                return res.status(400).json({ error: 'Task title is required' });
            }

            const newTask = { title, completed: false };
            const result = await tasksCollection.insertOne(newTask);
            res.status(201).json({ _id: result.insertedId, ...newTask });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error handling /api/tasks:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
