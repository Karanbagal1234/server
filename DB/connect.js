import mongoose from 'mongoose';

export default async function connect() {

    // Connection URI
    const uri = process.env.MONGODB_URI;
    
    // Connect to MongoDB
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    // Log when the connection  
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to ' + uri);
    });
}