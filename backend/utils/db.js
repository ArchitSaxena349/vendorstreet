import { connect } from 'mongoose';
import dns from 'dns';

// Force node's DNS resolver to use public DNS servers to bypass local ISP/environment DNS SRV lookup failures
try {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (err) {
    console.warn("Could not set DNS servers:", err.message);
}

const ConnectDB = async () =>{
    try{
        const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/VendorStreet';
        // Provide some sensible options and a short server selection timeout so failures surface quickly in platform logs
        await connect(URI, {
            // mongoose will infer the db from the URI; options below help reliability
            dbName: process.env.MONGODB_DBNAME || undefined,
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000, // fail fast if server is unreachable
            socketTimeoutMS: 45000
        });
        console.log("MongoDB connected successfully");
    }catch(error){
        console.error("Failed to connect to MongoDB:", error && error.message ? error.message : error);
        // Exit with non-zero so platform marks the deploy as failed and you can see the error in logs
        process.exit(1);

    }
}

export default ConnectDB;