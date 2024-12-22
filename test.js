import clientPromise from './mongodb.js';

async function test() {
    try {
        const client = await clientPromise;
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}

test();
