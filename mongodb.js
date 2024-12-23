import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://emirdincer:123@todo-list.kz09j.mongodb.net/?retryWrites=true&w=majority&appName=todo-list";
const options = {};

if (!uri) {
    throw new Error('Please add your MongoDB URI to .env.local');
}

let client = new MongoClient(uri, options);
let clientPromise = client.connect();

export default clientPromise;
