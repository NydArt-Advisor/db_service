const mongoose = require('mongoose');
require('dotenv').config();

async function dropIndex() {
    try {
        // Use the same connection string as the BDD service
        const mongoUri = process.env.MONGODB_URI || 
            `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.mongodb.net/art_advisor?retryWrites=true&w=majority`;
        
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB Atlas');
        
        const db = mongoose.connection.db;
        const collection = db.collection('artworks');
        
        // List all indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);
        
        // Drop the publicUrl index
        await collection.dropIndex('publicUrl_1');
        console.log('Successfully dropped publicUrl_1 index');
        
        // List indexes again to confirm
        const newIndexes = await collection.indexes();
        console.log('Indexes after dropping:', newIndexes);
        
        await mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

dropIndex(); 