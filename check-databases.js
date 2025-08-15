// Script to check what databases exist in your MongoDB cluster
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://darylnyd:vZBCU4GUFpyssA9n@cluster0.itukwfr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function checkDatabases() {
    try {
        console.log('Connecting to MongoDB cluster...');
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB cluster successfully!');
        
        // Get the admin database to list all databases
        const adminDb = mongoose.connection.db.admin();
        const dbList = await adminDb.listDatabases();
        
        console.log('\n=== Databases in your cluster ===');
        dbList.databases.forEach(db => {
            console.log(`- ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
        });
        
        // Check collections in each database
        console.log('\n=== Collections in each database ===');
        for (const db of dbList.databases) {
            if (db.name !== 'admin' && db.name !== 'local') {
                try {
                    const dbConnection = mongoose.connection.client.db(db.name);
                    const collections = await dbConnection.listCollections().toArray();
                    console.log(`\n${db.name}:`);
                    collections.forEach(col => {
                        console.log(`  - ${col.name}`);
                    });
                } catch (error) {
                    console.log(`\n${db.name}: Error accessing collections`);
                }
            }
        }
        
        await mongoose.disconnect();
        console.log('\n✓ Database check completed!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit(0);
    }
}

checkDatabases(); 