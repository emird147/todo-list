import { ObjectId } from 'mongodb';
import clientPromise from '../../mongodb.js';

export default async function handler(req, res) {
    const { id } = req.query;

    try {
        const client = await clientPromise;
        const db = client.db('todo-list');
        const tasksCollection = db.collection('tasks');

        if (req.method === 'PUT') {
            // Update task
            const { title, completed } = req.body;

            // Validate the request body
            if (title === undefined && completed === undefined) {
                return res.status(400).json({ error: 'Title or completed status is required' });
            }

            const updateFields = {};
            if (title !== undefined) updateFields.title = title;
            if (completed !== undefined) updateFields.completed = completed;

            const result = await tasksCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateFields }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }

            const updatedTask = await tasksCollection.findOne({ _id: new ObjectId(id) });
            return res.status(200).json(updatedTask);
        }

        if (req.method === 'DELETE') {
            // Delete task
            const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }

            return res.status(204).end(); // Successfully deleted
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error handling request:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
