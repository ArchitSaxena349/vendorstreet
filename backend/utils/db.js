
import { connect } from 'mongoose';

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/VendorStreet';

const ConnectDB = async () =>{
    try{
        await connect(URI);
        console.log("MongoDB connected successfully");
    }catch(error){
        console.log("Failed to connect to MongoDB");
        process.exit(0);

    }
}

export default ConnectDB;