const { connect, set } = require('mongoose');

const connectDB = async () => {
    set('strictQuery', false);
    
    // Use MONGODB_URI if available, otherwise construct from individual variables
    const mongoUri = process.env.MONGODB_URI || 
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.mongodb.net/art_advisor?retryWrites=true&w=majority`;
    
    await connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log('Successfully connected to database');
        })
        .catch((err) => {
            console.error('Database connection error:', err);
            process.exit(1);
        });
};

module.exports = connectDB; 